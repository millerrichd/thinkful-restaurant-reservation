const knex = require("../db/connection");

/** 
 * Return a single table
 */
function read(tableId) {
  return knex("tables as t")
    .select("*")
    .where({"t.table_id": tableId})
    .first();
}

/**
 * Return all tabless
 */
function list() {
  return knex("tables as t")
    .select("*")
    .orderBy("t.table_name")
}

/**
 * Create new table
 */
function create(table) {
  return knex("tables as t")
    .insert(table)
    .returning("*")
    .then(created => created[0])
}

/**
 * Set the seat
 */
function seat(tableId, reservationId) {
  return knex("tables as t")
    .where({"t.table_id": tableId})
    .update({reservation_id: reservationId}, "t.reservation_id" )
    .then(updated => updated[0]);
}

module.exports = {
  create,
  read,
  list,
  seat
}