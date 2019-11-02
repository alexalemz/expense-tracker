// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (req.user) {
    return next();
  }

  // If the user isn't logged in, store their intended path in req.session.redirectTo,
  // then redirect them to the login page
  req.session.redirectTo = req.path;
  return res.redirect("/login");
};
