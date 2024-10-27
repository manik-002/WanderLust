const express = require("express");
const app = express();
const Listings  = require("../Models/listing.js");
const review  = require("../Models/review.js");
const path = require("path");

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));


const addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comments } = req.body;
  const author_id = req.user._id
  try {
    const newReview = new review({
      Comments: comments,
      Rating: rating,
      author : author_id
    });

  
    const savedReview = await newReview.save();
    console.log("Review is saved:", savedReview);

  
    const listing = await Listings.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    listing.reviews.push(savedReview._id);
    await listing.save();
    req.flash("success","New Review created.");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
};

const deleteReview = async(req,res)=>{
  let { id , review_id } = req.params;

  try {
    await Listings.findByIdAndUpdate(id,{ $pull :{reviews : review_id} });
    await review.findByIdAndDelete(review_id);
    req.flash("success","Review deleted.");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred.", error: err.message });
  }
    
};

module.exports = {
  addReview,
  deleteReview
}