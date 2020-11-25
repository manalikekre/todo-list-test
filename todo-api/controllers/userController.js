const User = require("../models/User");

//login
exports.login = async (req, res) => {
  //
};

//register
exports.createUser = async (req, res) => {
  async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const newUser = await user.save();
    res.send(newUser);
  };
};
