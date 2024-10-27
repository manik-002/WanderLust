const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../Models/listing.js");



main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}


const initdb = async () => {
    await Listing.deleteMany({});

    initdata.data = initdata.data.map((obj) =>({
        ...obj,
        owner : "670cd2d3cc24ab1e910ac0ed",
    }));

    await Listing.insertMany(initdata.data)
    .then(()=>{
        console.log("saved sucessfully");
    })
    .catch(err =>{
        console.log(err);
    });
};


initdb();