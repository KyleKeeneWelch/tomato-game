const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  // Authenticates user and displays appropriate error flash messages
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
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
  passport.serializeUser((user, done) => done(null, user.id));
  // Grab user id in session.
  passport.deserializeUser((id, done) => {
    done(null, getUserById(id));
  });
}

module.exports = initialize;
