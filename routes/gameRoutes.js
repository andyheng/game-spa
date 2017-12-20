// Dependencies
const express = require("express");
const app = express();
const router = express.Router();

// Require the database
const database = require("../models");

// create the routes
router.get("/", (req, res) => {
    database.Game.find()
      .then(all => {
        res.json(all);
      })
      .catch(err => {
        res.send(err);
      })
});

router.post("/", (req, res) => {
  database.Game.create(req.body)
    .then(created => {
      console.log(`${created.title} was added`)
      res.json(created);
    })
    .catch(err => {
      console.log(err);
      res.send("error");
    })
})

router.get("/:id", (req, res) => {
  database.Game.findById(req.params.id)
    .then(found => {
      res.json(found);
    })
    .catch(err => {
      console.log(err);
      res.send("error");
    });
})

router.delete("/:id", (req, res) => {
  database.Game.findByIdAndRemove(req.params.id)
    .then(deleted => {
      console.log(`${deleted.title} was deleted`);
    })
    .catch(err => {
      console.log(err);
    })
})

// export the router to app.js to use
module.exports = router;