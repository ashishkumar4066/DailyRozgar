var mongoose = require("mongoose");

const request = mongoose.Schema({
    customername: String,
    workername: String
        //    date: String
});

module.exports = mongoose.model("Request", request);