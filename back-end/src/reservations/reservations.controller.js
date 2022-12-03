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
    const error = new Error(`A 'people' is required to be a number and positive.`);
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
  if(data.reservation_time.match(/\d?:\d{2}/)) {
    next();
  } else {
    const error = new Error(`A 'reservation_time' is required to be a HH:MM format.`);
    error.status = 400;
    throw error;
  }
 }

/**
 * List handler for reservation resources
 */
async function list(req, res) {
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

module.exports = {
  list,
  create: [
    hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"),
    validatePeopleIsANumber,
    validateDateIsFormattedCorrect,
    validateTimeIsFormattedCorrect,
    asyncErrorBoundary(create)]
};
