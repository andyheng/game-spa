// Dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Serve static files
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, "views")));
// app.use(express.static(path.join(__dirname, "public")))

// Require the router
const gameRoutes = require("./routes/gameRoutes.js");

//Routes
app.get("/", (req, res) => {
    res.send("hello world?");
});

// Use router routes
app.use("/api/games", gameRoutes);

//Listen
app.listen(3000 || process.env.PORT, () => {
    console.log("app started on port 3000");
})