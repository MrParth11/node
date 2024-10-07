const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("../model/userSchema"); // Admin/User schema

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",  // Specify the field names correctly
      passwordField: "password",
      passReqToCallback: true,  // Pass the entire request to the callback
    },
    async (req, email, password, done) => {
      try {
        const admin = await Users.findOne({ email });

        // If admin is not found
        if (!admin) {
          return done(null, false, { message: "Admin not found" });
        }

        // Check if the password matches
        if (password !== admin.password) {
          return done(null, false, { message: "Incorrect password" });
        }

        // Admin is authenticated
        return done(null, { admin });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user (admin) into the session
passport.serializeUser((data, done) => {
  done(null, { id: data.admin._id });
});

// Deserialize user (admin) from the session
passport.deserializeUser(async (data, done) => {
  try {
    const admin = await Users.findById(data.id);
    if (!admin) {
      return done(new Error("Failed to deserialize admin"));
    }
    done(null, { admin });
  } catch (error) {
    done(error, false);
  }
});

// Middleware to check if admin is authenticated
passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};

// Middleware to set the authenticated admin
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.admin = req.user.admin;  // Set the authenticated admin in locals
  }
  next();
};

module.exports = passport;
