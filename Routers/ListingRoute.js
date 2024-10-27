const express = require('express');
const app = express();
const router = express.Router();
const path = require("path");
const multer = require('multer');
const {storage} = require("../utils/cloudConfig.js");
const upload = multer({storage});
const  {ListingValidation} = require("../Middlewares/Validation.js");
const {AllListing,newListing,getListing,createListing,editListingPage,editListing,deleteListing} = require("../Controllers/ListingController.js")
const {isloggedin,isOwner} = require("../Middlewares/AuthValidation.js");

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

router.get("/", AllListing);

router.get("/new",isloggedin,newListing);

router.get("/:id", getListing);

router.post("/", isloggedin,upload.single('Image'),ListingValidation,createListing);

router.get("/:id/edit",isloggedin,editListingPage);

router.put("/:id",isloggedin,isOwner,upload.single('Image'),ListingValidation,editListing);

router.delete("/:id",isloggedin,isOwner,deleteListing);



module.exports = router;