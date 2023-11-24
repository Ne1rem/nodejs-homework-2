const express = require("express");
const router = express.Router();

const UsersController = require("../../controllers/user");
const { validateBody, authenticate } = require("../../middleware");
const { schemas } = require("../../models/user");

router.post("/register",  validateBody(schemas.schema), UsersController.register);
router.post("/login",  validateBody(schemas.schema), UsersController.login);
router.post("/logout", authenticate, UsersController.logout);
router.get("/current", authenticate, UsersController.current);

module.exports = router;
