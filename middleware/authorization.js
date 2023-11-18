const jwt = require("jsonwebtoken");
const HttpError = require("../HttpErrors/httpErrors");
const { User } = require("../models/user");

require("dotenv").config();
const secret = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, secret);
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      return next(HttpError(401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = authenticate;
