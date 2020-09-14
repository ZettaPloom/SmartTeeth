const express = require("express");
const router = express.Router();

const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

// SIGNUP
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

// SINGIN
router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", (req, res, next) => {
  req.check("username", "Username is Required").notEmpty();
  req.check("password", "Password is Required").notEmpty();
  req.check("verificationCode", "Verification Code is Required").notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash("message", errors[0].msg);
    res.redirect("/signin");
  }
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, (req, res) => {
  async (req, username, password, done) => {
    const rows = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(
        password,
        user.password
      );
      if (validPassword) {
        done(null, user, req.flash("success", "Welcome " + user.username));
      } else if (!validPassword) {
        done(null, false, req.flash("message", "Incorrect Password"));
      }
    } else if (rows.length <= 0) {
      return done(
        null,
        false,
        req.flash("message", "The Username does not exists.")
      );
    }
  };
  getFavoritesAndWikis(req);
  async function getFavoritesAndWikis(req) {
    const favorites = await pool.query(
      "SELECT * FROM favorites WHERE user_id = ?",
      [req.user.id]
    );
    const wikis = await pool.query("SELECT * FROM wikis WHERE user_id = ?", [
      req.user.id,
    ]);
    res.render("profile", { favorites, wikis });
  }
});

module.exports = router;
