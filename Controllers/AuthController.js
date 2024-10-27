const express = require("express");
const app = express();
const User = require("../Models/User.js");
const path = require("path");

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));


const newuser = async (req,res)=>{
    res.render("users/signup.ejs");
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "User with this email already exists.");
            return res.redirect("/login"); // Redirect to login page 
        
        }

        const user = new User({
            email,
            username,
        });

        const newuser = await User.register(user, password);
        req.login(newuser,(err)=>{
            if(err){
                console.log(err);
            }
            req.flash("success","Welcome to WanderLust.");
            res.redirect("/listings");
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred during registration.");
        res.redirect("/signup"); 
    }
};

const loginpage = (req,res)=>{
    res.render("users/login.ejs");
};

const login = async (req,res)=>{
    req.flash("success","Welcome to WanderLust !");
    let redirect = res.locals.redirectURL || "/listings";
    res.redirect(redirect);
};

const logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }
        req.flash("success","you are logged out.");
        res.redirect("/listings");
    })
}



module.exports = {
    newuser,
    signup,
    loginpage,
    login,
    logout
};