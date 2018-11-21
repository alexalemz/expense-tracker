module.exports = function(sequelize, DataTypes) {
    var Expense = sequelize.define("Expense", {
      description: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      date: DataTypes.DATE,
    });

    Expense.associate = function(models) {
      Expense.belongsTo(models.User, {});
      Expense.belongsTo(models.Category, {});
    }

    return Expense;
};
  