var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Category.findAll({}).then(function(dbCategories) {
      // var expensesParams = req.body.UserId ? {
      //   where: {
      //     UserId: req.body.UserId
      //   }
      // } : {where: {UserId: 0}};
      // console.log("UserId", req.body.UserId);
      // console.log("expensesParams", expensesParams);
      // db.Expense.findAll(expensesParams).then(function(dbExpenses) {
        res.render("index", {
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
    db.Expense.findOne({ where: { id: req.params.id } }).then(function(dbExpense) {
      db.Category.findAll({}).then(function(dbCategories) {
        res.render("expense", {
          title: "Edit Expense",
          expense: dbExpense,
          categories: dbCategories
        });
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
    res.render("registration");
  })

  // Load login page
  app.get("/login", function(req, res) {
    res.render("login");
  })

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
