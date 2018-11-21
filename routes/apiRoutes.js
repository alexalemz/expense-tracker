var db = require("../models");
var Sequelize = require("sequelize");

const Op = Sequelize.Op;

module.exports = function(app) {

  // Get all expenses from a certain user
  app.get("/api/expenses", function(req, res) {
    console.log("In apiRoutes. req.query", req.query);
    var UserId = req.query.UserId;
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
    db.Expense.create(req.body).then(function(dbExpense) {
      res.json(dbExpense);
    });
  });

  // Edit an expense
  app.put("/api/expenses/:id", function(req, res) {
    const updatedExpense = req.body;
    db.Expense.update(updatedExpense, {
        where: {
          id: req.params.id
        }
      }).then(function(dbExpense) {
        res.json(dbExpense);
      });
  });

  // Delete an expense
  app.delete("/api/expenses/:id", function(req, res) {
    db.Expense.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbExpense) {
      res.json(dbExpense);
    })
  })

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
