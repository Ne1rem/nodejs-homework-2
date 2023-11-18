const express = require("express");
const router = express.Router();

const UsersController = require("../../controllers/user");
const { validateBody, authenticate } = require("../../middleware");
const { schemas } = require("../../models/user");

router.post("/register", authenticate, validateBody(schemas.schema), UsersController.register);
router.post("/login", authenticate, validateBody(schemas.schema), UsersController.login);
router.post("/logout", authenticate, UsersController.logout);
router.get("/current", authenticate, UsersController.current);

module.exports = router;
