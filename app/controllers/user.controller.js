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
    const token = req.cookies.token;

    if(!token){
      return res.status(402).send({message: 'Token not provided'});
    }
    
    const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    res.status(200).send({ user });
  };