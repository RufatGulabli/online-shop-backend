const knex = require("knex");
const config = require("config");

const db_connection = knex({
  client: config.get("DB.client"),
  connection: {
    host: config.get("DB.host"),
    user: config.get("DB.user"),
    password: config.get("DB.password"),
    database: config.get("DB.database"),
    debug: true
  }
});

module.exports = {
  db_connection
};
