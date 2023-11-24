const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get Tojen from header
      token = req.headers.authorization.split(" ")[1];

      //varify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //get user form the token
      req.user = await User.findById(decoded.id).select("-password");
      // console.log(req.user)

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorised");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized,no token");
  }
});

module.exports = { protect };
