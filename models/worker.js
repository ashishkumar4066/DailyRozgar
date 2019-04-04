var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var workerSchema = new mongoose.Schema({
    username: String,
    password: String,
});

workerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Work", workerSchema);