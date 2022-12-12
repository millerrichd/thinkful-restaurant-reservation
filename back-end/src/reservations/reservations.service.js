const knex = require("../db/connection");

/**
 * Return a single reservation
 */
function read(reservationId) {
  return knex("reservations as r")
    .select("*")
    .where("r.reservation_id", reservationId)
    .first();
}

/**
 * Return all reservations
 */
function list(queryDate) {
  if(!queryDate) {
    return knex("reservations as r")
      .select("*")
      .whereNot({"r.status": "finished"})
  } else {
    return knex("reservations as r")
      .select("*")
      .where("r.reservation_date", queryDate)
      .whereNot({"r.status": "finished"})
      .orderBy("r.reservation_time")
  }
}

/**
 * Create new reservation
 */
function create(reservation) {
  return knex("reservations as r")
    .insert(reservation)
    .returning("*")
    .then(created => created[0])
}

/**
 * Update the status of a reservation
 */
function updateStatus(reservationId, newStatus) {
  return knex("reservations as r")
    .where({"r.reservation_id": reservationId})
    .update({status: newStatus}, "r.status" )
    .then(updated => updated[0]);
}

module.exports = {
  create,
  list,
  read,
  updateStatus
}