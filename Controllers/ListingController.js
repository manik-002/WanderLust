require('dotenv').config();
const express = require("express");
const app = express();
const Listings  = require("../Models/listing.js");
const path = require("path");


app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

const AllListing = async (req, res) => {
  try {
    const allListings = await Listings.find({});

    res.render("listings/index.ejs", { listings : allListings });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while retrieving listings.");
  }
};

const newListing = (req,res)=>{

  res.render("listings/new.ejs");
    
};

const getListing = async (req, res) => {
  let { id } = req.params;
  //console.log(typeof(id));
  
  try {
    const property = await Listings.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('owner');  

    if (!property) {
      res.flash("error","This Listing does not exist.");
      res.redirect("/listings"); 
    }
    //console.log(property);
    res.render("listings/show.ejs", { property });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error"); 
  }
};

const createListing = async (req, res, next) => {
  const { Title, Description, Price, Location, Country } = req.body;
  const owner = req.user._id;

  if (!Title || !Description || !Price || !Location || !Country || !req.file) {
    req.flash("error", "All fields are required.");
    return res.redirect("/listings/new"); // redirect to the form
  }

  let url = req.file.path;
  let filename = req.file.filename;

  try {
    const newListing = {
      title: Title,
      description: Description,
      image: { url, filename },
      price: Price,
      location: Location,
      country: Country,
      owner: owner,
    };

    await Listings.create(newListing); 
    
    console.log("Saved listing.");
    
    req.flash("success", "New Listing created.");
    res.redirect("/listings");
      
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "An error occurred while creating the listing.");
    res.redirect("/listings/new"); 
  }
};


const editListingPage = async (req,res,next)=>{
  let { id } = req.params;

  try {
    const property = await Listings.findById(id);
    let ogImageURL = property.image.url;
    ogImageURL = ogImageURL.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{property , ogImageURL});

  } catch (error) {
    next(error);
  }
      
};

const editListing = async (req, res) => {
  let { id } = req.params;
  let { Title, Description, Price, Location, Country } = req.body;

  try {
    const property = await Listings.findById(id);

    if (!property) {
      req.flash("error", "This Listing does not exist.");
      return res.redirect("/listings");
    }

    property.title = Title;
    property.description = Description;
    property.price = Price;
    property.location = Location;
    property.country = Country;
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      property.image = { url, filename };
    }

    await property.save();

    console.log("Listing is updated.");
    req.flash("success", "Listing is updated.");
    res.redirect("/listings");

  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while updating the listing.");
    res.redirect("/listings");
  }
};

const deleteListing = async (req,res)=>{
  let {id} = req.params;
  
  try {
 
    const deletedlisting = await Listings.findByIdAndDelete(id)
    .then(()=>{
      console.log("deleted successfully.");
    });
    cloudinary.v2.api.delete_resources(deletedlisting.image.filename, { type: 'upload', resource_type: 'image' })
    .then(console.log);


  } catch (error) {
    console.log(error);
  }
  req.flash("success","Listing is deleted.");
  res.redirect("/listings");
    
};

module.exports = {
  AllListing,
  newListing,
  getListing,
  createListing,
  editListingPage,
  editListing,
  deleteListing
}
