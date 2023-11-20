const express = require("express");
const contactRequest = require("../../controllers/contacts");
const router = express.Router();
const { validateBody, authenticate } = require("../../middleware");
const { schemas } = require("../../models/contactsSchema");

router.get("/", authenticate, contactRequest.listContacts);

router.get("/:contactId", authenticate, contactRequest.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  contactRequest.addContact
);

router.delete("/:contactId", authenticate, contactRequest.removeContact);

router.put(
  "/:contactId",
  authenticate,
  validateBody(schemas.addSchema),
  contactRequest.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(schemas.changeFavoriteSchema),
  contactRequest.updateFavorite
);

module.exports = router;
