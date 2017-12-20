// Set all mongoose settings here

const mongoose = require("mongoose");
const uri = "mongodb://localhost/games-api";
mongoose.Promise = Promise;
mongoose.connect(uri, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});

// Export the module
module.exports.Game = require("./gameSchema");