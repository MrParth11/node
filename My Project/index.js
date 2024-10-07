const express = require("express");
const port = 9090;
const path = require("path");
const database = require("./config/db");  // Assuming db is correctly configured
const passport = require("passport");
const localSt = require("./config/passport");  // Local strategy for passport
const session = require("express-session");
const app = express();

// Setting view engine to ejs
app.set("view engine", "ejs");

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // For JSON
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/Admin", express.static(path.join(__dirname, "public")));
app.use('/Admin/EditMainCategory', express.static(path.join(__dirname, 'public')));
app.use('/Admin/EditSubCategory', express.static(path.join(__dirname, 'public')));
app.use('/Admin/EditCategory', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session management
app.use(session({
    name: "demoSession",
    secret: 'myBatch',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 100 * 100 * 60 }  // Session expiry time
}));

// Initialize passport and manage sessions
app.use(passport.initialize());
app.use(passport.session());

// Set authenticated user for view templates
app.use(passport.setAuthenticatedUser);

// Routes
app.use("/", require("./routes/Auth"));
app.use("/Admin", require("./routes/Admin"));


// Start the server
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server started on port " + port);
    }
});
