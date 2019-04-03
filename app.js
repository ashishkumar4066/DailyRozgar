const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose"),
    Cust = require("./models/customer"),
    Work = require("./models/worker"),
    CustomerDetails = require("./models/customerDetails"),
    WorkerDetails = require("./models/workerDetails"),
    Request = require("./models/request"),
    //   Request1 = require("./models/request1"),
    Accept = require("./models/accept"),
    //   WorkerDetails1 = require("./models/workerDetails1"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
var Cont = require("./models/content");
var seeDB = require("./seeds");
var cookieParser = require('cookie-parser');
const session = require("express-session");
const getCustomer = require("./controller/request");
const getAccept = require("./controller/accept");
const getDelete = require("./controller/del");

const async_error = require("express-async-errors");
seeDB();

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: '6d6dfd9d',
    apiSecret: 'sF4Y2TYRHIRnOb7Q'
});

mongoose.connect("mongodb://localhost/customer_worker_auth_details_v4");

//mongoose.connect("mongodb://ashish:dailyrozgar123@ds155864.mlab.com:55864/daily_rozgar");

app.use(cookieParser('mySecretKey'));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: false,
    session: true
}));
//  code to set up passport to work in our app -> THESE TWO METHODS/LINES ARE REQUIRED EVERY TIME
app.use(passport.initialize());
app.use(passport.session());
//plugins from passportlocalmongoose in customer.js file

passport.use('customer', new LocalStrategy(Cust.authenticate()));

passport.use('worker', new LocalStrategy(Work.authenticate()));

//////////////////////////////////////////////////////////////

function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
}
passport.serializeUser(function(userObject, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    let userGroup = 'customer';
    let userPrototype = Object.getPrototypeOf(userObject);

    if (userPrototype === Cust.prototype) {
        userGroup = 'customer';
    } else if (userPrototype === Work.prototype) {
        userGroup = 'worker';
    }

    let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
    done(null, sessionConstructor);
});

passport.deserializeUser(function(sessionConstructor, done) {

    if (sessionConstructor.userGroup == 'customer') {
        Cust.findOne({
            _id: sessionConstructor.userId
        }, '-localStrategy.password', function(err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
    } else if (sessionConstructor.userGroup == 'worker') {
        Work.findOne({
            _id: sessionConstructor.userId
        }, '-localStrategy.password', function(err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
    }

});
////////////////////////////////////////////////////////////////

// ROUTES 
//===================================================

// INDEX page
app.get('/', (req, res) => {
    res.render("index.ejs");
});

// CUSTOMER Sign-UP Routes
app.get('/customerSignUp', (req, res) => {
    res.render("customerSignUp.ejs");
});
app.post('/customerSignUp', (req, res) => {
    Cust.register(new Cust({ username: req.body.username }), req.body.password, function(err, customer) {
        if (err) {
            console.log(err);
            return res.render("customerSignUp");
        }
        passport.authenticate('customer')(req, res, function() {
            console.log("SignUp Successful")
            res.redirect('/workerDetails');
        });
    })
});

// CUSTOMER LOGIN Routes
app.get('/customerLogIn', (req, res) => {
    res.render("customerLogIn.ejs");
});
app.post('/customerLogIn', passport.authenticate('customer', {
    successRedirect: "/workerDetails",
    failureRedirect: "/customerLogIn"
        //   session: true
}), function(req, res) {
    console.log("Login Successful");
});

// CUSTOMER LOGOUT Routes
app.get('/LogOut', (req, res) => {
    req.logout();
    res.redirect('/');
    console.log("Logout Successful")
});

// CUSTOMER Self Details
app.get('/customerSelfDetails', (req, res) => {

    res.render("customerSelfDetails.ejs");
});

app.post('/customerSelfDetails', (req, res) => {
    console.log("Customer Self Details");
    var fname = req.body.fname,
        lname = req.body.lname,
        contact = req.body.contact,
        male = req.body.male,
        female = req.body.female,
        flate = req.body.flate,
        street = req.body.street,
        landmark = req.body.landmark,
        locality = req.body.locality,
        city = req.body.city,
        state = req.body.state,
        zip = req.body.zip;

    //  fname = fname.toLowerCase();

    var newCustomer = {
        fname: fname,
        lname: lname,
        contact: contact,
        male: male,
        female: female,
        flate: flate,
        street: street,
        landmark: landmark,
        locality: locality,
        city: city,
        state: state,
        zip: zip
    };
    CustomerDetails.create(newCustomer, function(err, newCustomer) {
        if (err) {
            console.log(err);
        } else {
            console.log(newCustomer);
            res.redirect('/workerDetails');
        }
    })
});

// Worker signup Routes
app.get('/workerSignUp', (req, res) => {
    res.render("workerSignUp.ejs");
});
app.post('/workerSignUp', (req, res) => {
    Work.register(new Work({ username: req.body.username }), req.body.password, function(err, worker) {
        if (err) {
            console.log(err);
            return res.render("workerSignUp");
        }
        passport.authenticate('worker')(req, res, function() {
            console.log("Worker signUp Successful")
            res.redirect('/workerLogIn');
        });
    });
});
// Worker Login Routes
app.get('/workerLogIn', (req, res) => {
    res.render("workerLogIn.ejs");

});

app.post('/workerLogIn',
    passport.authenticate('worker'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/workerSelfPage');
    });


// ============================== //
app.get('/workerSelfPage', async(req, res) => {

    console.log("In /workerSelfPage");
    console.log(req.user.username);
    let workername = req.user.username;
    await getCustomer.request(req, res, workername);

});

app.post('/workerSelfPage', (req, res) => {
    var wname = req.user.username,
        cname = req.body.cname;
    console.log(req.user.username);

    var newAccept = {
        cname: cname,
        wname: wname
    };

    Accept.create(newAccept, function(err, contents) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/workerSelfPage');
        }
    });

});
app.get('/accepted', async(req, res) => {
    var cname = req.user.username;
    console.log("In accepted");
    console.log(cname);

    await getAccept.accept(req, res, cname);

});

app.get('/workerSelfDetails', (req, res) => {
    res.render("workerSelfDetails.ejs");
});
app.post('/workerSelfDetails', (req, res) => {
    console.log("Worker Self details");
    var firstname = req.body.firstname,
        lastname = req.body.lastname,
        contactno = req.body.contactno,
        age = req.body.age,
        gender = req.body.gender,
        occupation = req.body.Occupation,
        area = req.body.area,
        zcode = req.body.zcode,
        state = req.body.state,
        city = req.body.city,
        bamnt = req.body.bamnt;

    var newWorker = {
        firstname: firstname,
        lastname: lastname,
        age: age,
        contactno: contactno,
        gender: gender,
        occupation: occupation,
        area: area,
        zcode: zcode,
        state: state,
        city: city,
        bamnt: bamnt
    };

    WorkerDetails.create(newWorker, function(err, newWorker) {
        if (err) {
            console.log(err);
        } else {
            console.log(newWorker);
            res.redirect('workerSelfPage');
        }
    });
    // WorkerDetails1.create(newWorker, function(err, newWorker) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(newWorker);
    //         res.redirect('workerSelfPage');
    //     }
    // });
});

app.get('/workerDetails', (req, res) => {
    console.log("In Worker Details");
    console.log(req.user);
    Cont.find({}, function(err, contents) {
        if (err) {
            console.log(err);
        } else {
            res.render("workerDetails.ejs", { contents: contents });
        }
    });
});

app.get('/workerDetails/:title', (req, res) => {
    WorkerDetails.find({ occupation: req.params.title }, function(err, contents) {
        if (err) {
            console.log(err);
        } else {
            res.render("show.ejs", { contents: contents });
        }
    });
});

app.post('/workerDetails', (req, res) => {
    var customername = req.user.username,
        workername = req.body.workername;

    //   workername = workername.toLowerCase();

    console.log(req.user.username);
    //    var id = req.params.id;
    //   console.log("req.params.id " + req.params.id);
    var newRequest = {
        customername: customername,
        workername: workername,

    };

    Request.create(newRequest, async function(err, contents) {
        if (err) {
            console.log(err);
        } else {
            console.log("In Request function");
            // var p = window.prompt("date");
            //         await getDelete.del(req, res, customername);
            res.redirect('/workerDetails');
        }
    });


});
// Middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/customerLogIn');
}
app.listen(3000, () => {
    console.log(`Server started on port`);
});