
exports.up = function(knex) {
  return knex.schema.alterTable("reservations", function (table) {
    table.date("reservation_date");
    table.time("reservation_time");
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable("reservations", function (table) {
    table.dropColumn("reservation_date");
    table.dropColumn("reservation_time");
  })
};
