const express = require("express");
const router = express.Router();
const pool = require("../database");

const { isLoggedIn } = require("../lib/auth");

router.get("/wikis", isLoggedIn, async (req, res) => {
  res.render("wikis/index.html");
});

router.post("/favorite", isLoggedIn, async (req, res) => {
  const newLink = {
    user_id: req.user.id,
    title: req.body.title,
    link: req.body.url,
  };
  const exists = await pool.query(
    "SELECT * FROM favorites WHERE user_id = ? AND link = ?",
    [newLink.user_id, newLink.link]
  );
  if (exists.length <= 0)
    await pool.query("INSERT INTO favorites SET ? ", newLink);
});

router.get('/wikis/created/add', (req, res) => {
  res.render('wikis/add');
});


router.post("/wikis/created/add", isLoggedIn, async (req, res) => {
  const { title, category, content } = req.body;
  const newWiki = {
    title,
    category,
    content,
    link: "http://localhost:4000/wikis#/"+category+"/"+category+"?id="+title.toLowerCase().replace(/\s+/g,"-"),
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO wikis set ?", [newWiki]);
  //Código para editar las wikis del server
  req.flash("success", "Wiki creada con éxito");
  res.redirect("/profile");
});

router.get("/wikis/favorites/delete/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM favorites WHERE ID = ?", [id]);
  req.flash("success", "Wiki favorita borrada");
  res.redirect("/profile");
});

router.get("/wikis/created/delete/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM wikis WHERE ID = ?", [id]);
  req.flash("success", "Wiki creada borrada");
  res.redirect("/profile");
});

module.exports = router;
