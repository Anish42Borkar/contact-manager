import express from "express";
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from "../controllers/contactController.js";
import { validateToken } from "../middleware/validateTokenHandler.js";
const router = express.Router();

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

// router.param("id", (req, res, next, id) => {
//   console.log(id);
//   next();
// });

export default router;
