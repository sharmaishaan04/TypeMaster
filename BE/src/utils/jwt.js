const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
