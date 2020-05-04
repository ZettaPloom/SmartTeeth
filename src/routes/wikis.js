const express = require("express");
const router = express.Router();
var fs = require("fs");
var Path = require("path");

const { isLoggedIn } = require("../lib/auth");

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

router.get("/wikis", isLoggedIn, async (req, res) => {
  var path = "./src/public/wikis";
  fs.readdir(path, function (err, items) {
    res.render("wikis/main", { items });
  });
});

router.get("/wikis/:folder", isLoggedIn, async (req, res) => {
  const { folder } = req.params;
  var path = "./src/public/wikis/" + folder;
  fs.readdir(path, function (err, items) {
    items = items.filter(function (e) {
      return Path.extname(e).toLowerCase() === ".html";
    });
    if (folder === "Dientes") res.render("wikis/dientes", { items });
    else if (folder === "Enfermedades") res.render("wikis/enfermedades", { items });
    else if (folder === "Tratamientos") res.render("wikis/tratamientos", { items });
  });
});

module.exports = router;
