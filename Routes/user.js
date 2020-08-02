const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  const db = req.app.get("db");

  db.from("users")
    .select()
    .then((data) => {
      if (data) {
        res.send(data);
      } else res.send("data not found");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res) => {
  const db = req.app.get("db");
  db("users")
    .insert(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

/* 
Route defined for updating records.
*/
router.put("/:id", (req, res) => {
  const db = req.app.get("db");
  //check if any record with given id exists.
  db.from("users")
    .where({ id: req.params.id })
    .select()
    .then((data) => {
      if (data && data.length) {
        //update the record and return a promise.
        return db("users").where({ id: req.params.id }).update(req.body);
      }
      //No record found thus return a rejected promise (To be handled in catch block)
      return Promise.reject({ message: "The record was not found." });
    })
    .then(() =>
      // send response as the record has been successfully updated.
      res.status(200).send({
        ...req.body,
        status: true,
        message: "The record has been updated successfully.",
      })
    )
    .catch((err) => {
      // handle the rejected promises or any error encountered during entire process
      if (err.message)
        res.status(400).send({ message: err.message, status: false });
      else
        res
          .status(500)
          .send({ status: false, message: "Something went wrong." });
    });
});

/*
Route defined for deleting records.
*/
router.delete("/:id", (req, res) => {
  const db = req.app.get("db");
  //check if any record with given id exists.
  db.from("users")
    .where({ id: req.params.id })
    .select()
    .then((data) => {
      if (data && data.length) {
        //Record exists. Delete it and return a promise
        return db("users").where({ id: req.params.id }).del();
      }
      //Record not found. Return rejected promise to be handled in catch block
      return Promise.reject({ message: "The record was not found." });
    })
    .then(() => {
      //Handle the response (The Record has been successfully deleted.)
      res.status(200).send({
        status: true,
        message: "The record has been successfully deleted.",
      });
    })
    .catch((err) => {
      //Handle rejected promise or any other error encountered.
      if (err.message)
        res.status(400).send({ message: err.message, status: false });
      else
        res
          .status(500)
          .send({ message: "Something went wrong.", status: false });
    });
});

module.exports = router;
