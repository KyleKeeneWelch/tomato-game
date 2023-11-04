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
const _database = require("./scripts/database");
const http = require("http");

const database = new _database();
database.connect();

// Separates passport initialization from server. Injects functions to find user by email and id.
const initializePassport = require("./scripts/passport-config");
initializePassport(passport, database);

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
// Allows parsing of incoming json data
app.use(express.json());

// Routes //////////////////////

// Pass in name from serialized user. Check if authenticated and redirect to login if not.
app.get("/", checkAuthenticated, (req, res) => {
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

app.post("/highscores", checkAuthenticated, async (req, res) => {
  try {
    const data = {
      user: req.user,
      score: req.body.score,
      createdAt: Date.now(),
    };
    await database.create(data, "scores");
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

app.get("/highscores", checkAuthenticated, async (req, res) => {
  try {
    const highScores = await getHighScores();
    const response = JSON.stringify(highScores);
    res.setHeader("Content-Type", "application/json");
    res.end(response);
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

app.get("/userhighscores", checkAuthenticated, async (req, res) => {
  try {
    let highScores = null;
    let isAuthenticated = false;
    let promiseArray = [];

    if (req.isAuthenticated()) {
      isAuthenticated = true;
      highScores = await getHighScores();

      highScores.forEach((score) => {
        promiseArray.push(
          new Promise(async (resolve) => {
            const user = await database.findOneUser({
              _id: score.user.toString(),
            });
            resolve(user.name);
          })
        );
      });

      Promise.all(promiseArray)
        .then((names) => {
          let highScoreData = [];
          highScores.forEach((highScore, index) => {
            highScoreData.push({
              name: names[index],
              score: highScore.score,
              date: highScore.createdAt.toDateString(),
            });
          });
          return highScoreData;
        })
        .then((highScoreData) => {
          res.render("highscores.ejs", {
            isAuthenticated: isAuthenticated,
            data: highScoreData,
          });
        });
    }
  } catch (e) {
    console.log(e);
    res.redirect("/");
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

async function getHighScores() {
  return await database.findHighScores();
}

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
