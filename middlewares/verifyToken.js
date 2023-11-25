const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.status(401).json({ message: 'No token, authorization not granted' });
  }

  const token = bearerHeader.split(' ')[1]; // Split at the space character

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Authorization denied' });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;