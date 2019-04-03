const Accept = require("../models/accept");
const Request = require("../models/request");
const WorkerDetails = require("../models/workerDetails");

async function accept(req, res, cname) {
    console.log("In async and await");
    console.log(cname);
    const acc = await Accept.find();
    console.log(acc);
    var found = [];
    var i, count = 0;
    console.log(typeof(acc.length));
    for (i = 0; i < acc.length; i++) {
        if (acc[i].cname === cname) {
            found[i] = await WorkerDetails.find({ firstname: acc[i].wname });
        }

    }
    console.log("Found 1st content");
    console.log(found[0]);

    console.log("Found 2nd content");
    console.log(found[1]);

    console.log("Found 2nd content name");
    //    console.log(found[1][0].fname);

    let result = Object.values(found);
    console.log(result);
    res.render("accepted.ejs", { result: result });


}

module.exports.accept = accept;