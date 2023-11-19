const jwt = require("jsonwebtoken");
const HttpError = require("../HttpErrors/httpErrors");
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization = " " } = req.headers;
  const [bearer, token] = authorization.split(" ", 2)
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized1"));
  }
  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized2"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized3"));
  }
};

module.exports = authenticate;