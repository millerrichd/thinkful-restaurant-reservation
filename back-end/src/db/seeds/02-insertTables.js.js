const data = require("./02-tables.json")
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tables').del()
    .then(function () {
      // Inserts seed entries
      return knex('tables').insert(data);
    });
};
