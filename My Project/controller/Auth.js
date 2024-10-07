const User = require('../model/userSchema');
const passport = require('../config/passport');
module.exports.loginform = (req, res) => {
  res.render("login"); 
};
module.exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new User({ email, password, role });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error during signup", error });
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // Redirect based on user role
      if (user.admin.role === 'admin') {
        return res.redirect('/Admin/dashboard');
      } else if (user.admin.role === 'user') {
        return res.redirect('/user/dashboard');
      } else {
        return res.redirect('/user/profile');
      }
    });
  })(req, res, next);
};



module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out", error: err });
    }
    res.status(200).json({ message: "Successfully logged out" });
  });
};
