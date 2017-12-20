// Dependencies
const mongoose = require("mongoose");

// Create the schema
const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title cannot be blank"
    },
    image: {
        type: String,
        default: "bop"
    },
    completed: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;