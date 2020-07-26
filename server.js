const express = require("express");
const faker = require("faker");
const app = express();
app.listen(3002, () => {
  console.log("Hello");
});
app.get("/", (req, res) => {
  res.json("Hello Team");
});

const db = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "1234",
    database: "postgres"
  }
});

app.set("db", db);
app.get("/seed", function (req, res, next) {
  const db = req.app.get("db");
  db.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      db.schema
        .createTable("users", function (table) {
          table.increments("id").primary();
          table.string("name");
          table.string("email");
        })
        .then(function () {
          const recordsLength = Array.from(Array(100).keys());
          const records = recordsLength.map(() => ({
            name: faker.name.findName(),
            email: faker.internet.email()
          }));
          db("users")
            .insert(records)
            .then(() => {
              res.send("Seeded data");
            });
        });
    } else {
      res.send("Table exists - Seeded data");
    }
  });
});
