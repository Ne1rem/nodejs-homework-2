const fs = require("node:fs/promises");
const path = require("node:path");

const User = require("../models/user");

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.avatarURL === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.sendFile(path.join(__dirname, "../public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.join(__dirname, "../public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(req.user.id, 
    { avatarURL: req.file.filename },
    {new:true}).exec()
    
    if (user === null) {
        return res.status(404).send({ message: "User not found" });
      };
    res.send(user)
  } catch (error) {
    next(error);
  }
}

module.exports = {getAvatar, uploadAvatar}