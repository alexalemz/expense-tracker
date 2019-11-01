require("dotenv").config();
var express = require("express");
var favicon = require("serve-favicon");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
var exphbs = require("express-handlebars");

// initalize sequelize with session store
var SequelizeStore = require("connect-session-sequelize")(session.Store);

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ 
  secret: "keyboard cat", 
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(require("express-flash")());
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
