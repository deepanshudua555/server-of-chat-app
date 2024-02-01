import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  getAllChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/accesschat").post(isAuthenticated, accessChat);
router.route("/getallchats").get(isAuthenticated, getAllChats);
router.route("/creategroupchat").post(isAuthenticated, createGroupChat);
router.route("/renamegroup").put(isAuthenticated, renameGroup);
router.route("/addtogroup").put(isAuthenticated, addToGroup);
router.route("/removefromgroup").put(isAuthenticated, removeFromGroup);

export default router;
