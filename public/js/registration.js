$(document).ready(function() {
  // When the form is submitted
  $("form").on("submit", function(event) {
    event.preventDefault();

    // Capture form data
    let userData = {
      email: $("#email").val().trim(),
      password: $("#password").val().trim(),
      passwordMatch: $("#passwordMatch").val().trim()
    }

    // Return if one of the fields is empty
    if (!userData.email || !userData.password || !userData.passwordMatch) {
      return;
    }

    if (userData.password !== userData.passwordMatch) {
      $("#passwordMatch").addClass("is-invalid");
      return;
    }

    // Submit form data to the register route.
    $.ajax("/api/register", {
      type: "POST",
      data: {
        email: userData.email,
        password: userData.password
      }
    }).then(function(data) {
      // Go to whatever address was sent back.
      window.location.replace(data);
    }).catch(function(err) {
      console.log("Error: ", err);
      // $("#alert .msg").text(err.responseJSON);
      $("#alert .msg").text("Error", err.responseText);
      $("#alert").fadeIn(500);
    })
  })
})