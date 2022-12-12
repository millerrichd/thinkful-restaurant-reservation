const moment = require("moment");
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/**
 * Confirm that property people is a positive number
 */
function validatePeopleIsANumber(req, res, next) {
  const { data = {} } = req.body;
  if(Number.isInteger(data.people) && data.people > 0) {
    next();
  } else {
    const error = new Error(`'People' is required to be a number and positive.`);
    error.status = 400;
    throw error;
  }
}

/**
 * validate that the date is in YYYY-MM-DD format
 */
function validateDateIsFormattedCorrect(req, res, next) {
  const { data = {} } = req.body;
  if(data.reservation_date.match(/\d{4}-\d{2}-\d{2}/)) {
    next();
  } else {
    const error = new Error(`A 'reservation_date' is required to be a YYYY-MM-DD format.`);
    error.status = 400;
    throw error;
  }
}

/**
 * validate the time is formatted correctly
 */
 function validateTimeIsFormattedCorrect(req, res, next) {
  const { data = {} } = req.body;
  if(data.reservation_time.match(/\d\d?:\d{2}/)) {
    next();
  } else {
    const error = new Error(`A 'reservation_time' is required to be a HH:MM format.`);
    error.status = 400;
    throw error;
  }
}

function validateWindow(req, res, next) {
  const { data = {} } = req.body;
  const today = moment();
  const testDateTime = moment(`${data.reservation_date}T${data.reservation_time}Z`);

  if(testDateTime < today) { 
    const error = new Error(`Date occurs in the past. Please select a date and time in the future.`)
    error.status = 400;
    throw error;
  } else if (testDateTime.format('dddd') === "Tuesday") {
    const error = new Error(`We are closed on Tuesday's, please select another day.`)
    error.status = 400;
    throw error;
  } else if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    const error = new Error(`The restaurant does not accept reservations before 10:30 AM and after 9:30 PM.`)
    error.status = 400;
    throw error;
  }
  next();
}

/** 
 * Validate Status is booked on a new reservation
 */
function validateStatusIsBookedForPost(req, res, next) {
  const { data = {} } = req.body;
  if(data.status === "booked") {
    next()
  } else if (data.status === "seated") {
    const error = new Error(`The status can not start as 'seated' for a new reservation.`)
    error.status = 400;
    throw error;
  } else if (data.status === "finished") {
    const error = new Error(`The status can not start as 'finished' for a new reservation.`)
    error.status = 400;
    throw error;
  } else {
    const error = new Error(`Unknown status, can only start as 'booked' for a new reservation.`)
    error.status = 400;
    throw error;
  }
}

/** 
 * Validate that the new status can be set when compared to existing status
 */
function validateStatusComparedToExisting(req, res, next) {
  const { data = {} } = req.body;
  const existingReservation = res.locals.reservation
  if(data.status !== "booked" && data.status !== "seated" && data.status !== "finished") {
    const error = new Error(`Status '${data.status}' unknown`);
    error.status = 400;
    throw error;
  } else if(existingReservation.status === "finished") {
    const error = new Error(`Status is currently finished so can not be updated.`)
    error.status = 400;
    throw error;
  } else {
    next()
  }
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  console.log(`received the following date: ${req.query.date}`)
  const data = await service.list(req.query.date);
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
 * Read the current reservation record
 */
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const data = await service.read(reservationId);
  if(data) {
    res.locals.reservation = data;
    return next();
  }
  next({status: 404, message: `Reservation '${reservationId}' not found.`});
}

async function read(req, res, next) {
  const data = res.locals.reservation;
  res.json({data});
}

async function updateStatus(req, res, next) {
  const { data = {} } = req.body;
  const { reservationId } = req.params;
  const result = await service.updateStatus(reservationId, data.status)
  res.json({data: { status: result}})
}

module.exports = {
  list,
  create: [
    hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"),
    validatePeopleIsANumber,
    validateDateIsFormattedCorrect,
    validateTimeIsFormattedCorrect,
    validateWindow,
    validateStatusIsBookedForPost,
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    read
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validateStatusComparedToExisting,
    asyncErrorBoundary(updateStatus)
  ]
};
