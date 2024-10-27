const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const User =  require("./Models/User.js");
const ListingRoute = require("./Routers/ListingRoute.js");
const ReviewRoute = require("./Routers/ReviewRoute.js");
const AuthRoute = require("./Routers/AuthRoute.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require('connect-mongo');
const DB_URL = process.env.ATLASDB_URL;

const port = 8080;

const mongostore = MongoStore.create({
  mongoUrl: DB_URL,
  touchAfter : 24*60*60,
  crypto: {
    secret: process.env.SECRET
  }
});
mongostore.on(err,()=>{
  console.log("error in mongo session store\n");
  console.log(err);
});

const sessionOptions = {
  store : mongostore,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie :{
    httpOnly : true,
    maxAge : 7 * 24 * 60 *60 * 1000,
    expires : Date.now() + 7 * 24 * 60 *60 * 1000
  }
};



app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(()=>{
  console.log("connected to database.");
})
.catch(err => console.log(err));
async function main() {
  mongoose.connect(DB_URL);
}

app.listen(port,()=>{
  console.log(`server is listening on ${port}.`);
});

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user;
  
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  };

  next();
});

app.use("/",AuthRoute);
app.use("/listings",ListingRoute);
app.use("/listings/:id/reviews",ReviewRoute);

app.use((err,req,res,next)=>{
  res.send(err);
});

app.use((req,res)=>{
  res.send("page not found!");
});