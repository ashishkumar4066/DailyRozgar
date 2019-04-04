var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var customerSchema = new mongoose.Schema({
    username: String,
    password: String,
});

customerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Customer", customerSchema);