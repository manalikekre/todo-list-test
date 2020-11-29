const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

// how long a token lasts before expiring
const tokenLasts = "20m";

//login
exports.login = async (req, res) => {
  cleanUp(req.body);
  User.findOne({ username: req.body.username })
    .then((attemptedUser) => {
      if (
        attemptedUser &&
        bcrypt.compareSync(req.body.password, attemptedUser.password)
      ) {
        let data = attemptedUser;
        res.json({
          token: jwt.sign(
            {
              _id: data._id,
              username: data.username,
            },
            process.env.JWTSECRET,
            { expiresIn: tokenLasts }
          ),
          username: data.username,
        });
      } else {
        res.json(false);
      }
    })
    .catch(function (e) {
      res.json("Please try again later.");
    });
  //
};

//register
exports.createUser = async (req, res) => {
  let data = cleanUp(req.body);
  const errors = await validate(data);

  // Step #2: Only if there are no validation errors
  // then save the user data into a database
  if (!errors.length) {
    // hash user password
    let salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    const user = new User(data);
    const newUser = await user.save();
    console.log(newUser);
    res.json({
      token: jwt.sign(
        {
          _id: newUser._id,
          username: newUser.username,
        },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      username: user.username,
    });
  } else {
    res.status(500).send(errors);
  }
};

//logged in verification
exports.userMustBeLogedIn = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.get("Authorization"), process.env.JWTSECRET);
    next();
  } catch (e) {
    res.status(500).send("Sorry, you must provide a valid token.");
  }
};

//check token expired
exports.checkToken = function (req, res) {
  try {
    req.apiUser = jwt.verify(req.get("Authorization"), process.env.JWTSECRET);
    res.json(true);
  } catch (e) {
    res.json(false);
  }
};

//does user exist
exports.doesUsernameExist = function (req, res) {
  let username = req.body.username.toLowerCase();
  if (typeof username != "string") {
    res.json({ error: "Provide valid username" });
  }
  User.findOne({ username: username })
    .then(function (userDoc) {
      if (userDoc) {
        res.json(true);
      } else {
        res.json(false);
      }
    })
    .catch(function (e) {
      res.json(false);
    });
};

//does email exist
exports.doesEmailExist = async function (req, res) {
  let email = req.body.email;
  if (typeof email != "string") {
    res.json({ error: "Provide valid email" });
    return;
  }

  let user = await User.findOne({ email: email });
  if (user) {
    res.json(true);
  } else {
    res.json(false);
  }
};

const cleanUp = function (data) {
  if (typeof data.username != "string") {
    data.username = "";
  }
  if (typeof data.email != "string") {
    data.email = "";
  }
  if (typeof data.password != "string") {
    data.password = "";
  }

  // get rid of any bogus properties
  return {
    username: data.username.trim().toLowerCase(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  };
};

const validate = function (data) {
  return new Promise(async (resolve, reject) => {
    let errors = [];
    if (data.username == "") {
      errors.push("You must provide a username.");
    }
    if (data.username != "" && !validator.isAlphanumeric(data.username)) {
      errors.push("Username can only contain letters and numbers.");
    }
    if (!validator.isEmail(data.email)) {
      errors.push("You must provide a valid email address.");
    }
    if (data.password == "") {
      errors.push("You must provide a password.");
    }
    if (data.password.length > 0 && data.password.length < 12) {
      errors.push("Password must be at least 12 characters.");
    }
    if (data.password.length > 50) {
      errors.push("Password cannot exceed 50 characters.");
    }
    if (data.username.length > 0 && data.username.length < 3) {
      errors.push("Username must be at least 3 characters.");
    }
    if (data.username.length > 30) {
      errors.push("Username cannot exceed 30 characters.");
    }

    // Only if username is valid then check to see if it's already taken
    if (
      data.username.length > 2 &&
      data.username.length < 31 &&
      validator.isAlphanumeric(data.username)
    ) {
      let usernameExists = await User.findOne({
        username: data.username,
      });
      if (usernameExists) {
        errors.push("That username is already taken.");
      }
    }

    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(data.email)) {
      let emailExists = await User.findOne({
        email: data.email,
      });
      if (emailExists) {
        errors.push("That email is already being used.");
      }
    }

    resolve(errors);
  });
};
