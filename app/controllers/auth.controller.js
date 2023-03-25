const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {

  if (!req.body.password) {
    return res.status(400).send({ message: "Password is required" });
  }
  
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });
  
  try {
    const savedUser = await user.save();

    if (req.body.roles) {

      const roles = await Role.find({ name: { $in: req.body.roles } });

      savedUser.roles = roles.map(role => role._id);
      await savedUser.save();

    } else {

      const role = await Role.findOne({ name: "user" });

      savedUser.roles = [role._id];
      await savedUser.save();
      
    }

    res.send({ message: "User was registered successfully!" });
    
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
      .populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
