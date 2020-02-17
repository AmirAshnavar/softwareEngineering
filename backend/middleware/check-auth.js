const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "ASDScxczr$r2df$RFdsscdc/DCdds667/sYE8a4iHixhaXfD3N");
    req.userData = { username: decodedToken.username, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
