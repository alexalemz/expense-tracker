$(document).ready(function() {
    $("#view-expenses").on("submit", function(event) {
        event.preventDefault();

        console.log("Clicked on viewExpenses");

        // Get the values of each input in the form
        var dateSearch = $("#date-search").val();
        var dateRangeMin = $("#date-range-min").val();
        var dateRangeMax = $("#date-range-max").val();
        console.log("daterangemin", dateRangeMin,"ddaterangemax", dateRangeMax);
        var CategoryId = $("#category-search").val();
        var description = $("#description-search").val().trim();

        // Put all of the applicable values in the search.
        var searchData = {
            UserId: 1,
            DateRange: [],
            description: description,
            CategoryId: CategoryId
        };

        if (dateSearch === "last30days") {
            searchData.DateRange = [
                moment().subtract(30, "days").format("YYYY-MM-DD"), 
                moment().format("YYYY-MM-DD")
            ];
        }
        else if (dateSearch === "customrange") {
            searchData.DateRange = [
                moment(dateRangeMin, "YYYY-MM-DD").format("YYYY-MM-DD"), 
                moment(dateRangeMax, "YYYY-MM-DD").format("YYYY-MM-DD")
            ];
        }

        console.log("searchData",searchData)

        $.ajax("/api/expenses", {
            type: "GET",
            data: searchData
        }).then(function(dbExpenses) {
            // Reverse the expenses, with the most recent being first.
            // dbExpenses.reverse();

            // Sort the expenses from most newest to oldest.
            dbExpenses.sort( (a, b) => moment(b.date) - moment(a.date) );

            console.log("dbExpenses returned", dbExpenses);

            const display = $("#expenses-display");
            display.empty();

            var table = `
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
            <tbody>
            `;

            // Create an html-string to display an expense record.
            function row(e) {
                //return `<p>  ${e.description} ${e.amount} ${moment(e.date).format("MM/DD/YYYY")} ${e.Category.category_name} </p>`;
                let row = $("<tr>");
                for (field of [moment(e.date).format("MM/DD/YYYY"), 
                    // Make the description a link to the page to edit the expense.
                    `<a href="/expense/${e.id}">${e.description}</a>`, 
                    "$" + e.amount.toFixed(2), e.Category.category_name
                ]) {
                    let td = $("<td>").html(field);
                    row.append(td);
                }
                return row.prop("outerHTML");
            }

            for (expense of dbExpenses) {
                //display.append(row(expense));
                table += row(expense);
            }

            table += `
            </tbody>
            </table>`;

            display.append(table);
        });
    });


    // Date range visibility toggle
    $("#date-search").on("change", function(event) {
        console.log("date search changed");
        console.log("current val is", $(this).val());

        var select = $(this);
        var selectVal = select.val();

        var dateRangeDiv = $("#date-range");
        if (selectVal === "last30days") {
            dateRangeDiv.css("display", "none");
        }
        else if (selectVal === "customrange") {
            dateRangeDiv.css("display", "inline-block");
        }
    });


    // Set Default Custom range dates
    $("#date-range-min").val(moment().subtract(1, "month").format("YYYY-MM-DD"))
    $("#date-range-max").val(moment().format("YYYY-MM-DD"));
})