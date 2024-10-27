const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comments : {
        type : String
    },
    Rating : {
        type: Number,
        min :0,
        max : 5
    },
    createdAt : {
        type:Date,
        default : Date.now()
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    } 
});

const review = mongoose.model("review",reviewSchema);

module.exports = review ;