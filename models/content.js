var mongoose = require("mongoose");

var contentSchema = mongoose.Schema({
    title: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Content", contentSchema);