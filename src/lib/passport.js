const passport = require("passport");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const LocalStrategy = require("passport-local").Strategy;

const pool = require("../database");
const helpers = require("./helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      verificationField: "verificationCode",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const rows = await pool.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const validVerification = speakeasy.totp.verify({
          secret: user.secret,
          encoding: "base32",
          token: req.body.verificationCode,
          window: 0,
        });
        if (validVerification) {
          const validPassword = await helpers.matchPassword(
            password,
            user.password
          );
          if (validPassword) {
            done(null, user, req.flash("success", "Welcome " + user.username));
          } else if (!validPassword) {
            done(null, false, req.flash("message", "Incorrect Password"));
          }
        } else if (!validVerification) {
          done(null, false, req.flash("message", "Invalid Verification Code"));
        }
      } else if (rows.length <= 0) {
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
      const secret = speakeasy.generateSecret({ length: 20 });
      const secretDB = secret.base32;
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
            secret: secretDB,
          };
          newUser.password = await helpers.encryptPassword(password);
          // Saving in the Database
          const result = await pool.query("INSERT INTO users SET ? ", newUser);
          newUser.id = result.insertId;
          const generateQR = async (text) => {
            try {
              return await QRCode.toDataURL(text);
            } catch (err) {
              console.error(err);
            }
          };
          const qr = await generateQR(secret.otpauth_url);
          req.flash("qr", qr);
          return done(null, newUser);
        } else if (password != confirmPassword) {
          req.flash("message", "The passwords doesn't match");
          return done(null, null);
        }
      } else if (exists.length > 0) {
        req.flash("message", "Username already exist");
        return done(null, null);
      }
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
