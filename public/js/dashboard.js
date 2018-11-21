$(document).ready(function() {

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                // 'rgba(255, 99, 132, 0.2)',
                "lightgreen",
                "orange",
                "#ff0000",
                // 'rgba(54, 162, 235, 0.2)',
                "#0000ff",
                // 'rgba(255, 206, 86, 0.2)',
                "#ffff00",
                // 'rgba(75, 192, 192, 0.2)',
                "#00ff00",
                // 'rgba(153, 102, 255, 0.2)',
                "#a020f0",
                // 'rgba(255, 159, 64, 0.2)'
                "#ffa500"
            ],
            // borderColor: [
            //     'rgba(255,99,132,1)',
            //     'rgba(54, 162, 235, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(75, 192, 192, 1)',
            //     'rgba(153, 102, 255, 1)',
            //     'rgba(255, 159, 64, 1)'
            // ],
            borderWidth: 2
        }]
    },
    options: {
        // scales: {
        //     yAxes: [{
        //         ticks: {
        //             beginAtZero:true
        //         }
        //     }]
        // }
        responsive: true
    }
  });
  
  // setTimeout(function() {
  //   myChart.data.labels[0] = "Rojo";
  //   myChart.update();
  // }, 2000);

  
  function generateChart(monthNum) {
    $.ajax("/api/expenses", {
      type: "GET",
      data: {
        UserId: 1,
        DateRange: ["2018-" + monthNum + "-01", "2018-" + (parseInt(monthNum) + 1) + "-10"],
        description: "",
        CategoryId: ""
      }
    }).then(function(dbExpenses) {
      console.log(dbExpenses);
      var categorySums = {};
    
      for (expense of dbExpenses) {
        var currentCategory = expense.Category.category_name;
        // console.log(currentCategory);
    
        // If the category is not in categorySums...
        if (categorySums[currentCategory] === undefined) {
          categorySums[currentCategory] = expense.amount;
        }
        // If it's in there, add it to the sum.
        else {
          categorySums[currentCategory] += expense.amount;
        }
      }
    
      console.log(categorySums)
    
      // Clear labels and Data
      myChart.data.labels = [];
      myChart.data.datasets[0].data = [];
    
      for (category in categorySums) {
        const sum = categorySums[category];
    
        // Add the Category Name to Labels
        myChart.data.labels.push(category);
        // Add the Sum to Data
        myChart.data.datasets[0].data.push(sum);
      }

      // Make chart visible
      $("#myChart").css("visibility", "visible");
    
      // Update myChart
      myChart.update();

      // Display the month in the heading.
      $("#selectedMonth").html(months[monthNum - 1])
    
    });
  }

  var monthSelect = $("#month")
  monthSelect.empty();
  const months = ["January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"];
  // for (monthNum in months) {
  for (let i=0; i < months.length; i++) {
    var monthName = months[i];
    var monthNum = i + 1;
    monthSelect.append(`<option value=${monthNum}>${monthName}</option>`);
  }

  var currentMonthNum = moment().format("M");
  
  // Have the current month selected in the drop-down menu.
  $(`#month [value=${currentMonthNum}]`).attr("selected", "selected");


  generateChart($("#month").val());


  // When the user selects a month and hits submit.
  $("#pie-chart").on("submit", function(event) {
    event.preventDefault();
    const month = $("#month").val();
    console.log(month);

    generateChart(month);
  });






});