const moment = require("moment");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/**
 * Validate table length is at least 2+ characters
 */
function verifyTableNameLength(req, res, next) {
  const { data } = req.body;
  if(data.table_name.length > 1) {
    next();
  } else {
    const error = new Error(`'table_name' must be at least 2 characters in length.`);
    error.status = 400;
    throw error;
  }
}

/**
 * Confirm that property capacity is a positive number
 */
function verifyCapacityIsNumber(req, res, next) {
  const { data } = req.body;
  if(Number.isInteger(data.capacity) && data.capacity > 0) {
    next();
  } else {
    const error = new Error(`'capacity' is required to be a number and positive.`);
    error.status = 400;
    throw error;
  }
}

/**
 * Verify the table has capacity
 */
async function verifyTableHasCapacity(req, res, next) {
  const { capacity, reservation_id } = res.locals.table;
  //if it is already occupied, throw an error
  if(reservation_id) {
    const error = new Error(`Table is already occupied.`)
    error.status = 400;
    throw error;
  }
  //get the reservation
  const reservation = await reservationService.read(req.body.data.reservation_id)
  //if the reservation does not exist throw an error
  if(!reservation) {
    const error = new Error(`'reservation reservation_id': ${req.body.data.reservation_id} not found.`);
    error.status = 404;
    throw error;
  }
  //save the reservation
  res.locals.reservation = reservation;
  //if the reservation is less or equal to capacity return next or throw error
  if(reservation.people <= capacity) {
    return next()
  } else {
    const error = new Error(`people is greater than capacity`)
    error.status = 400;
    throw error;
  }
}

/**
 * Read the table object from the db
 */
async function tableExists(req, res, next) {
  const {tableId} = req.params;
  const tableFound = await service.read(tableId);
  if(tableFound) {
    res.locals.table = tableFound;
    return next();
  }
  next({status: 404, message: "Table not found."});
}

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

/**
 * Create a new reservation record
 */
async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({data});
}

/** 
 * Seating a group at a table
 */
async function seat(req, res, next) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  const data = await service.seat(table_id, reservation_id);
  res.json({data})
}

module.exports = {
  list,
  create: [
    hasProperties("table_name", "capacity"),
    verifyTableNameLength,
    verifyCapacityIsNumber,
    asyncErrorBoundary(create)
  ],
  seat: [ 
    asyncErrorBoundary(tableExists),
    hasProperties("reservation_id"),
    asyncErrorBoundary(verifyTableHasCapacity),
    asyncErrorBoundary(seat)
  ]
};
