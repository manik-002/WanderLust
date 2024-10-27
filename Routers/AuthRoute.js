const express = require('express');
const router = express.Router();
const {newuser,signup, loginpage, login, logout} = require("../Controllers/AuthController.js");
const passport = require('passport');


router.get("/signup",newuser);

router.post("/signup",signup);

router.get("/login",loginpage);

router.post("/login",passport.authenticate("local",{ failureRedirect: '/login',failureFlash : true }),login);

router.get("/logout",logout);


module.exports = router;

