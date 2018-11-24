var db = require("../models");

module.exports = function(app) {

  // Middleware to setup local variables that will accessible 
  // in every pages context (for all routes in this file).
  app.use(function (req, res, next) {
    res.locals = {
      user: req.user ? req.user.email : undefined
    };
    next();
  });

  // Load index page
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      console.log(req.user.email);
      // res.redirect("/api/user_data")
      res.redirect("/addexpense");
    }
    else
      res.redirect("/login");
  })

  // Load Add Expense page
  app.get("/addexpense", function(req, res) {
    db.Category.findAll({}).then(function(dbCategories) {
      // var expensesParams = req.body.UserId ? {
      //   where: {
      //     UserId: req.body.UserId
      //   }
      // } : {where: {UserId: 0}};
      // console.log("UserId", req.body.UserId);
      // console.log("expensesParams", expensesParams);
      // db.Expense.findAll(expensesParams).then(function(dbExpenses) {
        res.render("addexpense", {
          msg: "Welcome!",
          title: "Add Expense",
          categories: dbCategories,
          // expenses: dbExpenses
        });
      // });
    });
  });

  app.get("/viewexpenses", function(req, res) {
    db.Category.findAll({}).then(function(dbCategories) {
      res.render("viewexpenses", {
        title: "View Expenses",
        categories: dbCategories
      });
    });
  })

  app.get("/dashboard", function(req, res) {
    res.render("dashboard", {
      title: "Dashboard",
    });
  })

  app.get("/expense/:id", function(req, res) {
    db.Expense.findOne({ where: { id: req.params.id, UserId: req.user.id } }).then(function(dbExpense) {
      db.Category.findAll({}).then(function(dbCategories) {
        res.render("expense", {
          title: "Edit Expense",
          expense: dbExpense,
          categories: dbCategories
        });
      }).catch(function(err) {
        res.json(err);
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Load registration page
  app.get("/register", function(req, res) {
    res.render("registration", {title: "Register"});
  })

  // Load login page
  app.get("/login", function(req, res) {
    res.render("login", {title: "Login"});
  })

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
