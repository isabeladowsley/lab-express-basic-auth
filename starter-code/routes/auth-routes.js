const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.create({
    username: username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
      console.log( 'User not created because of:', error)
  })
});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
  
    if (theUsername === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
  
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist."
          });
          return;
        }

        if (bcrypt.compareSync(thePassword, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/private");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error);
    })
  });



module.exports = router;