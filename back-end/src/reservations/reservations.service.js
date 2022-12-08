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
  } else {
    return knex("reservations as r")
      .select("*")
      .where("r.reservation_date", queryDate)
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

module.exports = {
  create,
  list,
  read
}