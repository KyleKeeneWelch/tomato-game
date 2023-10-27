// If in development, set env variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const _database = require("./database");

const database = new _database();
database.connect();

// Separates passport initialization from server. Injects functions to find user by email and id.
const initializePassport = require("./passport-config");
initializePassport(passport, database);

// async function findUser() {
//   const result = await database.findById("6532c9cbd1616f036fb1fc94", "users");
//   console.log(result);
// }
// findUser();

// Set the express app to use ejs as view engine
app.set("view-engine", "ejs");
// Allow access to form fields in request object from POST
app.use(express.urlencoded({ extended: false }));
// Enable flash messages
app.use(flash());
// Use sessions. Set secret that encrypts information
// Set resave false so session variables not saved if nothing changed
// Set saveUninitialized to false so do not save empty value in session if no value
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// Set up passport.
app.use(passport.initialize());
// Store variables to be persistent across entire session
app.use(passport.session());
// Override method to use delete instead of post
app.use(methodOverride("_method"));
// Serves static files
app.use(express.static(__dirname + "/public/"));

// Routes //////////////////////

// Pass in name from serialized user. Check if authenticated and redirect to login if not.
app.get("/", checkAuthenticated, (req, res) => {
  // console.log(req.user);
  let isAuthenticated = false;
  if (req.isAuthenticated()) {
    isAuthenticated = true;
  }
  res.render("index.ejs", {
    name: req.user.name,
    isAuthenticated: isAuthenticated,
  });
});

// Check if not authenticated and redirect to home if is.
app.get("/login", checkNotAuthenticated, (req, res) => {
  let isAuthenticated = false;
  if (req.isAuthenticated()) {
    isAuthenticated = true;
  }
  res.render("login.ejs", { isAuthenticated: isAuthenticated });
});

// Use passport local strategy to redirect and display flash messages upon authentication outcome.
//Check if not authenticated and redirect to home if is.
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Check if not authenticated and redirect to home if is.
app.get("/register", checkNotAuthenticated, (req, res) => {
  let isAuthenticated = false;
  if (req.isAuthenticated()) {
    isAuthenticated = true;
  }
  res.render("register.ejs", { isAuthenticated: isAuthenticated });
});

// Use bcrypt to hash the password for safe storage.
// Check if not authenticated and redirect to home if is.
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    database.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        address: { street: req.body.street, city: req.body.city },
      },
      "users"
    );
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

// Logout the user and delete session.
app.delete("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

///////////////////////

// Redirects to login if authenticated.
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Redirects to home if not authenticated.
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// Starts the server and listens on port 3000
app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
