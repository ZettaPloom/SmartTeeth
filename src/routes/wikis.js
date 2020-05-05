const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../lib/auth");

router.get("/wikis", isLoggedIn, async (req, res) => {
  res.render("wikis/index.html");
});

module.exports = router;
