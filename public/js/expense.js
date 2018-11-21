// Set the date picker to the date
console.log( $("#datedata").data("date") );
var date = $("#datedata").data("date");
$("#date").val(moment(date).format("YYYY-MM-DD"));

// Set the Category selecter
var categoryId = $("#categorydata").data("category");
console.log("category", categoryId);
$(`#category [value=${categoryId}]`).attr("selected", "selected");
// console.log( $(`#category [value='${categoryId}']`).html());

// console.log($("#date").attr("data-default"))
// console.log($("#date").data("default"));
// console.log($("#date").attr("secretdefault"))

// Get the id of the current expense
const expenseId = $("#iddata").val();
console.log(expenseId);


// When the edit form is submitted
$("#edit-expense").on("submit", function(event) {
  event.preventDefault();

  if (!confirm("Are you sure you want to edit this?")) {
    return;
  }

  var updatedExpense = {
    description: $("#description").val().trim(),
    amount: $("#amount").val().trim(),
    date: $("#date").val(),
    CategoryId: $("#category").val(),
    // This needs to be changed
    UserId: 1
  };

  // Do the ajax PUT request
  $.ajax("/api/expenses/" + expenseId, {
    type: "PUT",
    data: updatedExpense
  }).then(function(dbExpense) {
    location.reload();
  });
});


// When the delete button is pressed
$("#delete").on("click", function(event) {
  event.preventDefault();

  // Do the ajax PUT request
  $.ajax("/api/expenses/" + expenseId, {
    type: "DELETE"
  }).then(function(dbExpense) {
    location.reload();
  });
})