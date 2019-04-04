var mongoose = require("mongoose");

var workerDetails = mongoose.Schema({
    firstname: String,
    lastname: String,
    contactno: Number,
    occupation: String,
    age: Number,
    gender: { type: String, possibleValues: ['male', 'female'] },
    area: String,
    zcode: Number,
    state: String,
    city: String,
    bamnt: Number,

});

module.exports = mongoose.model("WorkerDetails", workerDetails);