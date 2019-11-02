var db = require("../models");
var Sequelize = require("sequelize");
const passport = require("../config/passport");

const Op = Sequelize.Op;

module.exports = function(app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    // res.json("/members");
    // res.json("Login successful");

    // After login, redirect the user to the homepage or to their intended address, if they had one.
    let redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;
    res.json(redirectTo);

    // res.json("/");
  });

  // Route for registering a new user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/register", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logOut();
    // Destroy the session, clear the cookies, and redirect to root.
    req.session.destroy(function(err) {
      res.clearCookie('connect.sid', {path: '/'});
      res.redirect('/');
    });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Get all expenses from a certain user
  app.get("/api/expenses", function(req, res) {
    console.log("In apiRoutes. req.query", req.query);
    // var UserId = req.query.UserId;
    var UserId = req.user.id;
    var DateRange = req.query.DateRange;
    var description = req.query.description;
    var CategoryId = req.query.CategoryId;
    
    var searchParams = {
      UserId: UserId,
      date: {
        [Op.between]: [new Date(DateRange[0]), new Date(DateRange[1])]
      },
      description: {
        [Op.like]: "%" + description + "%"
      }
    };
    if (CategoryId) searchParams["CategoryId"] = CategoryId;
    
    db.Expense.findAll({
      where: searchParams,
      include: ["Category"]
    }).then(function(dbExpenses) {
      // console.log("In apiRoutes. dbExpenses is", dbExpenses);
      res.json(dbExpenses);
    });
  });

  // Create a new expense
  app.post("/api/expenses", function(req, res) {
    req.body.UserId = req.user.id;
    db.Expense.create(req.body).then(function(dbExpense) {
      res.json(dbExpense);
    });
  });

  // Edit an expense
  app.put("/api/expenses/:id", function(req, res) {
    const updatedExpense = req.body;
    db.Expense.update(updatedExpense, {
        where: {
          id: req.params.id,
          UserId: req.user.id
        }
      }).then(function(dbExpense) {
        res.json(dbExpense);
      }).catch(function(err) {
        console.log(err);
        res.json(err);
      });
  });

  // Delete an expense
  app.delete("/api/expenses/:id", function(req, res) {
    db.Expense.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    }).then(function(dbExpense) {
      res.json(dbExpense);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  })

  // Delete the current user (and all of it's records)
  app.delete("/api/users", function(req, res) {
    db.User.destroy({
      where: {
        id: req.user.id
      }
    }).then(function(dbUser) {
      // Make sure to also log out the user and destroy the session.
      //Set HTTP method to GET
      // req.method = 'GET';
      // res.redirect('/logout');
      res.redirect(303, '/logout'); // This will set the method to GET anyway.
      // res.json(dbUser);
    }).catch(function(err) {
      res.json(err);
    })
  })

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
