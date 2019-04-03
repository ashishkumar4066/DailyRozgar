var mongoose = require("mongoose");

var accept = mongoose.Schema({
    cname: String,
    wname: String
});

module.exports = mongoose.model("Accept", accept);