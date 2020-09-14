module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else if (!req.isAuthenticated()) {
      return res.redirect("/signin");
    }
  },
  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else if (req.isAuthenticated()) {
      return res.redirect("/profile");
    }
  },
};
