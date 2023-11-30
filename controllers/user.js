const jwt = require("jsonwebtoken");
const {User} = require("../models/user")
const bcrypt = require("bcrypt");
const HttpError = require("../HttpErrors/httpErrors");
const gravatar = require("gravatar");
const fs = require("node:fs/promises");
const path = require("node:path");
const Jimp = require("jimp");
const secret = process.env.SECRET_KEY;
const sendEmail = require("../helper/sendEmail")
const crypto = require("node:crypto");

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  const verifyToken = crypto.randomUUID();
  await sendEmail({
    to: email,
    subject: "Welcome to my BookShelf",
    html: `To confirm your registration please click on the <a href="http://localhost:8080/api/auth/verify/${verifyToken}">link</a>`,
      text: `To confirm your registration please open the link http://localhost:8080/api/auth/verify/${verifyToken}`,
  });

  const id = newUser._id;
  const token = jwt.sign({ id }, secret, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
   const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult) {
    throw HttpError(401, "Email or password is wrong");
  }

  const id = user._id;
  const token = jwt.sign({ id }, secret, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  res.status(201).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const { email, subscription } = req.user;
    res.json({
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateAvatar(req,res,next) {
  try {
    const { _id } = req.user;

    const avatarDir = path.join(__dirname, "../public/avatars");
  
    if (!req.file) {
      const defaultImage = path.join(__dirname, "../public/avatars/znak_voprosa.png");
      const filename = `znak_voprosa.png`;
      await fs.copyFile(defaultImage, path.join(avatarDir, filename));
      const avatarURL = path.join("avatars", filename);
      await User.findByIdAndUpdate(_id, { avatarURL });
      return res.json({
        avatarURL,
      });
    }
  
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
  
    const resultUpload = path.join(avatarDir, originalname);
  
    await Jimp.read(tempUpload)
      .then((lenna) => lenna.resize(250, 250).write(resultUpload))
      .catch((e) => console.log(e));
  
    await fs.unlink(tempUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error)
  }
 
}

module.exports = { register, login, logout, current, updateAvatar };
