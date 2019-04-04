var mongoose = require("mongoose");
var Conte = require("./models/content");
var wd = require("./models/workerDetails");
var data = [{
        id: "1",
        title: "Electrician",
        image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Electricians install, maintain, repair, test and commission electrical and electronic equipment and systems for industrial, commercial and domestic purposes."
    },
    {
        id: "2",
        title: "Plumber",
        image: "http://enterpriseplumbinginc.com/communities/0/000/000/207/670//images/336345.jpg",
        description: "A plumber is a tradesperson who specializes in installing and maintaining systems used for potable (drinking) water, sewage and drainage in plumbing systems."
    },
    {
        id: "3",
        title: "Painter",
        image: "https://images.pexels.com/photos/1571174/pexels-photo-1571174.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Painter Job Duties: Preparing painting surfaces by washing walls, repairing holes, or removing old paint."
    },
    {
        id: "4",
        title: "Carpenter",
        image: "https://images.pexels.com/photos/38600/construction-worker-concrete-hummer-vibrator-38600.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Carpenters construct, repair, and install building frameworks and structures made from wood and other materials."
    },
    {
        id: "5",
        title: "House Keeper",
        image: "https://www.gigabook.com/blog/wp-content/uploads/2017/04/Housekeeper-Appointment-Software.jpg",
        description: "A housekeeper is an individual responsible for the supervision of a house's cleaning staff."
    },
    {
        id: "6",
        title: "Gardener",
        image: "https://images.pexels.com/photos/707194/pexels-photo-707194.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "The garden designer is someone who will design the garden, and the gardener is the person who will undertake the work to produce the desired outcome."
    }
];

function seeDB() {
    Conte.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed worker details");
        data.forEach(function(seed) {
            Conte.create(seed, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    console.log("Content added");


                }
            })
        });

    });

}

module.exports = seeDB;