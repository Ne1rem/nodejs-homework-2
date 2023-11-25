const express = require("express");
const router = express.Router();

const UsersController = require("../../controllers/user");
const { validateBody, authenticate } = require("../../middleware");
const { schemas } = require("../../models/user");
const upload = require("../../middleware/upload");

router.post("/register",  validateBody(schemas.schema), UsersController.register);
router.post("/login",  validateBody(schemas.schema), UsersController.login);
router.post("/logout", authenticate, UsersController.logout);
router.get("/current", authenticate, UsersController.current);
router.patch("/avatars", authenticate, upload.single("avatar"), UsersController.updateAvatar)

module.exports = router;
