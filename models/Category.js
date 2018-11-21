module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    category_name: DataTypes.STRING
  });
  return Category;
};
