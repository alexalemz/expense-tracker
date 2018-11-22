$(document).ready(function() {
  // When the form is submitted
  $("form").on("submit", function(event) {
    event.preventDefault();

    // Capture form data
    let userData = {
      email: $("#email").val().trim(),
      password: $("#password").val().trim()
    }

    // Return if one of the fields is empty
    if (!userData.email || !userData.password) {
      return;
    }

    // Submit form data to the login route.
    $.ajax("/api/login", {
      type: "POST",
      data: userData
    }).then(function(data) {
      // Go to whatever address was sent back.
      window.location.replace(data);
    }).catch(function(err) {
      console.log("Error: ", err);
      // $("#alert .msg").text(err.responseJSON);
      $("#alert .msg").text(err.responseText);
      $("#alert").fadeIn(500);
    })
  })
})