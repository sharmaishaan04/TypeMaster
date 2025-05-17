const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
};

module.exports = authenticate;
