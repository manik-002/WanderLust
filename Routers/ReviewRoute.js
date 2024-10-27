const express = require('express');
const app = express();
const router = express.Router({mergeParams : true});
const path = require("path");
const  { ReviewValidation } = require("../Middlewares/Validation.js");
const { addReview , deleteReview } = require ("../Controllers/ReviewController.js");
const { isloggedin, isOwner } = require('../Middlewares/AuthValidation.js');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

router.post("/",isloggedin,ReviewValidation, addReview);

router.delete("/:review_id",isOwner, deleteReview);

module.exports = router ;