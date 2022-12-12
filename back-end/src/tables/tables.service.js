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
async function seat(tableId, reservationId) {
  return await knex.transaction(async(trx) => {
    await Promise.all([
      trx("tables").where({table_id: tableId}).update({reservation_id: reservationId}, "reservation_id"),
      trx("reservations").where({reservation_id: reservationId}).update({status: "seated"}),
    ])
    return await knex.transaction(async(trx) => {
      trx("reservations").select('*').where({reservation_id: reservationId}).first()
    })
  })
}

/**
 * Delete a Seat's reservation_id
 */
async function deleteSeat(tableId) {
  const tables = await knex("tables").where({table_id: tableId}).select('*').first();
  return await knex.transaction(async(trx) => {
    await Promise.all([
      trx("tables").where({table_id: tableId}).update({reservation_id: null}, "reservation_id"),
      trx("reservations").where({reservation_id: tables.reservation_id}).update({status: "finished"}),
    ])
    return await knex.transaction(async(trx) => {
      trx("reservations").select('*').where({reservation_id: tables.reservation_id}).first()
    })
  })
}


module.exports = {
  create,
  read,
  list,
  seat,
  deleteSeat
}