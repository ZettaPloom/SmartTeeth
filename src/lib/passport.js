const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const pool = require("../database");
const helpers = require("./helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
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
        } else {
          done(null, false, req.flash("message", "Incorrect Password"));
        }
      } else {
        return done(
          null,
          false,
          req.flash("message", "The Username does not exists.")
        );
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const { confirmPassword } = req.body;
      const exists = await pool.query(
        "SELECT username FROM users WHERE username = ?",
        username
      );
      if (exists.length <= 0) {
        if (password == confirmPassword) {
          let newUser = {
            fullname,
            username,
            password,
          };
          newUser.password = await helpers.encryptPassword(password);
          // Saving in the Database
          const result = await pool.query("INSERT INTO users SET ? ", newUser);
          newUser.id = result.insertId;
          return done(null, newUser);
        } else {
          req.flash("message", "The passwords doesn't match");
          return done(null, null);
        }
      }
      req.flash("message", "Username already exist");
      return done(null, null);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, rows[0]);
});
