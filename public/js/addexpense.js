$(document).ready(function() {
    // Set the date to today's date.
    $("#date").val(moment().format("YYYY-MM-DD") );

    
    // When the Add Expense form is submitted.
    $("#add-expense").on("submit", function(event) {
        event.preventDefault();
        
        var newExpense = {
            description: $("#description").val().trim(),
            amount: $("#amount").val().trim(),
            date: $("#date").val(),
            CategoryId: $("#category").val(),
            // This needs to be changed
            UserId: 1
        };

        // Clear the fields
        $("#description").val("");
        $("#amount").val("");
        $("#date").val("");
        $("#category").val("");

        console.log(newExpense);

        // Post the data
        $.ajax("/api/expenses", {
            type: "POST",
            data: newExpense
        }).then(function(dbExpense) {
            // location.reload();
            $("#message-section").html(`
              <div class="alert alert-success alert-dismissible" role="alert">
                ${newExpense.description} was added!

                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            `)
        });
    });



    // Input validation for Amount
    $("#amount").on("keypress", function(event) {
        // // Figure out where the cursor/caret is.
        // console.log("selectionstart",event.target.selectionStart);
        // var selectionStart = event.target.selectionStart;
        // var selectionEnd   = event.target.selectionEnd;

        // console.log($(this).val())
        // event.preventDefault();
        // var currentVal = $(this).val();
        // var isDot = currentVal.includes(".");
        // $(this).val("");
        // console.log("amount changing", event.key);

        // var acceptableKey = (event.key >= "0" && event.key <= "9") || (event.key === ".");

        // if (acceptableKey) {
        //     // Make it so there can only be two decimal places.
        //     // If there is no dot, append the new character to the value.
        //     if (!isDot) {
        //         // $(this).val(currentVal + event.key);

        //         // Add the new character where the cursor/selection is.
        //         $(this).val(currentVal.slice(0,selectionStart) + event.key + currentVal.slice(selectionEnd));
        //     }
        //     else {
        //         // Get the amount of digits after the dot
        //         // Find the index of the dot, find the length of the string.
        //         let indexDot = currentVal.indexOf(".");
        //         let amtDecimals = currentVal.length - indexDot - 1;
        //         console.log("amtDecimals",amtDecimals);
        //         // Append the new character if less than two decimals.
        //         if (amtDecimals < 2 && event.key != "." || selectionStart <= indexDot) {
        //             // $(this).val(currentVal + event.key);

        //             // Add the new character where the cursor/selection is.
        //             $(this).val(currentVal.slice(0,selectionStart) + event.key + currentVal.slice(selectionEnd));
        //         }
        //         else {
        //             $(this).val(currentVal);
        //         }
        //     }
        // }
        // else {
        //     // Make no changes.
        //     $(this).val(currentVal);
        // }

        // // Update the cursor/selection position.
        // this.setSelectionRange(selectionStart + 1, selectionStart + 1);
    });

    // Convert amount to fixed 2 decimals when focusedout.
    $("#amount").on("focusout", function(event) {
        event.preventDefault();

        let inputVal = parseFloat($(this).val());
        if (inputVal) {
            $(this).val(inputVal.toFixed(2));
        }
    });
});