const Listings  = require("../Models/listing.js");

const isloggedin = (req,res,next) =>{

    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;

        req.flash("error","You must be logged in ");
        return res.redirect ("/login");
    }

    next();
};

const isOwner = async (req,res,next) =>{
    let {id} = req.params;
    const list = await Listings.findById(id).populate('owner');

    //console.log(req.user);
    if(!list.owner._id.equals(req.user._id)){
        req.flash("error","You don't have the premission.");
        return res.redirect("/listings");

    }
    next();
};


module.exports = {
    isloggedin,
    isOwner
};