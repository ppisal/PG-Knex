const express = require("express");
const faker = require("faker");
const app = express();
const user = require("./Routes/user");

app.use(express.json());

app.use("/user", user);

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
    database: "postgres",
  },
});

app.set("db", db);

/*

data base seeding 

*/
app.get("/seed", function (req, res, next) {
  const db = req.app.get("db");
  db.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      db.schema
        .createTable("users", function (table) {
          table.increments("id").primary();
          table.string("name");
          table.string("email");
          table.timestamp("created_at").defaultTo(db.fn.now());
        })
        .then(() => {
          db.schema.hasTable("items").then(function (exists) {
            if (!exists) {
              db.schema
                .createTable("items", function (table) {
                  table.increments("id").primary();
                  table.integer("user_id");
                  table.string("item");
                  table.boolean("private");
                  table.timestamp("created_at").defaultTo(db.fn.now());
                })
                .then(() => {
                  res.send("Created both the tables");
                });
            } else {
              res.send("Table exists - Seeded data");
            }
          });
        });
    } else {
      res.send("Table exists - Seeded data");
    }
  });
});
