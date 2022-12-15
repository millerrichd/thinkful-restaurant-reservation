const { query } = require("express");
const knex = require("../db/connection");

/**
 * Return a single reservation
 */
function read(reservationId) {
  return knex("reservations as r")
    .select("r.*")
    .where("r.reservation_id", reservationId)
    .first();
}

/**
 * Return all reservations
 */
function list(queryDate, queryMobileNumber) {
  if(!queryDate && !queryMobileNumber) {
    return knex("reservations as r")
      .select("*")
      .whereNot({"r.status": "finished"})
  } else if(queryMobileNumber) {
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${queryMobileNumber.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
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

function update(reservation) {
  return knex("reservations as r")
    .select("r.*")
    .where({"r.reservation_id": reservation.reservation_id})
    .update(reservation, "*")
    .then(updated => updated[0]);
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
  updateStatus,
  update
}