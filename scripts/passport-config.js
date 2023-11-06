const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Initializes passport for authentication.
function initialize(passport, database) {
  // Authenticates user and displays appropriate error flash messages
  const authenticateUser = async (email, password, done) => {
    const user = await database.findOneUser({ email: email });
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // Compare hashed password with entered password
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };
  // Use local strategy. Set email as username field. Set authenticateUser as function to authenticate.
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  // Store user id in session.
  passport.serializeUser((user, done) => done(null, user._id.toString()));
  // Grab user id in session.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await database.findById(id, "users");
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  });
}

module.exports = initialize;
