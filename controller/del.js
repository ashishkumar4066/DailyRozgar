const Request = require("../models/request");
const WorkerDetails = require("../models/workerDetails");


async function del(req, res, customername) {

    console.log("In request1 delete async and await");
    console.log(customername);
    const requ = await Request.find();
    console.log(requ);
    var found = [];
    var calc = [];
    //   console.log(typeof(found));
    var i, count = 1;
    console.log(typeof(requ.length));
    for (i = 0; i < requ.length; i++) {
        if (requ[i].customername === customername) {
            found[i] = await WorkerDetails1.findOneAndDelete({ firstname: requ[i].workername });

        }
    }

    console.log("Found 1st content");
    console.log(found[0]);

    console.log("Found 2nd content");
    console.log(found[1]);

    console.log(typeof(found));
    console.log(found);

    console.log("In Object.values(found)");
    console.log(Object.values(found));

    // let result = Object.values(found);

    // res.render("show.ejs", { contents: result });

}

module.exports.del = del;