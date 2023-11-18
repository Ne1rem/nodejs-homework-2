const express = require("express");

const router = express.Router();

const AuthController = require("../../controllers/contacts");
const { validateBody } = require("../../middleware");
const { schemas } = require("../../models/user");

router.post("/register", validateBody(schemas.schema), AuthController.register);
router.post("/login", validateBody(schemas.schema), AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/current", AuthController.current);

module.exports = router;
