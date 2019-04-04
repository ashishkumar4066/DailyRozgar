var mongoose = require("mongoose");

var customerDetails = mongoose.Schema({
    fname: String,
    lname: String,
    contact: Number,
    gender: { type: String, possibleValues: ['male', 'female'] },
    locality: String,
    city: String,
    state: String,
    zip: Number
});

module.exports = mongoose.model("CustomerDetails", customerDetails);