const Request = require("../models/request");
const CustomerDetails = require("../models/customerDetails");

async function request(req, res, workername) {

    console.log("In async and await");
    console.log(workername);
    const requ = await Request.find();
    console.log(requ);
    var found = [];
    //   console.log(typeof(found));
    var i, count = 1;
    console.log(typeof(requ.length));
    for (i = 0; i < requ.length; i++) {
        if (requ[i].workername === workername) {
            found[i] = await CustomerDetails.find({ fname: requ[i].customername });

        }
    }

    console.log("Found 1st content");
    console.log(found[0]);

    console.log("Found 2nd content");
    console.log(found[1]);

    console.log("Found 2nd content name");

    console.log("In web page condition");
    console.log(typeof(found));
    console.log(found);

    console.log("In Object.values(found)");
    console.log(Object.values(found));

    let result = Object.values(found);
    res.render("workerSelfPage.ejs", { found: result });



}

module.exports.request = request;