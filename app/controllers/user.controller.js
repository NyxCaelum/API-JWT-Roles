  const jwt = require("jsonwebtoken");
  const config = require('../config/auth.config.js');
  
  exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  exports.userData = (req, res) => {
  const token = req.headers["x-access-token"];

    if(!token){
      return res.status(402).send({message: 'Token not provided'});
    }
    
    // const buffer = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const user = jwt.verify(token, config.secret);

    res.status(200).send({ user });
  };
