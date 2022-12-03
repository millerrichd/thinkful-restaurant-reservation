
exports.up = function(knex) {
  return knex.schema.alterTable("reservations", function (table) {
    table.dropColumn("reservation_date");
    table.dropColumn("reservation_time");
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable("reservations", function (table) {
    table.string("reservation_date");
    table.string("reservation_time");
  })
};
