const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review  = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url : {
            type : String,
        },
        filename : {
            type : String,
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0, 
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }

});

listingSchema.post("findByIdAndDelete", async (listing)=>{
    if (listing){
        await review.deleteMany({_id : {$in : listing.reviews}});
    };
});


const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;