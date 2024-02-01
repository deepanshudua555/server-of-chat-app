import express from "express";
import {
  forgetPassword,
  getAllUser,
  getMyProfile,
  login,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  verify,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/verify").post(isAuthenticated, verify);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/forgotpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);
router.route("/getalluser").get(isAuthenticated,getAllUser);


export default router;
