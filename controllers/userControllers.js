import { User } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // const otp = 123456;
    const otp = Math.floor(Math.random() * 9999) + 1000;
    user = await User.create({
      name,
      email,
      password,
      pic,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });
    // await sendMail(email,"verify your account", `Your OTP is ${otp}`);
    sendToken(
      res,
      user,
      201,
      "OTP sent to your email, please verify your account"
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all the fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid e-mail or password " });
    }

    const isMathch = await user.comparePassword(password);
    if (!isMathch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid e-mail or password " });
    }
    sendToken(res, user , 200, "Login Successfully");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);
    const user = await User.findById(req.user._id);
    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been expired" });
    }
    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();
    sendToken(res, user, 200, "Account Verified");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, pic } = req.body;
    if (name) user.name = name;
    if (pic) user.pic = pic;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;
    const isMathch = await user.comparePassword(oldPassword);
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all the fields" });
    }
    if (!isMathch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Old Password" });
    }
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    // const otp = Math.floor(Math.random()*9999)+1000;
    const otp = 123456;
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    const message = `Your OTP for reseting the password is ${otp}. If you did not request for this, please ignore this email.`;
    // await sendMail(email, " Request for resetting password", message);
    res.status(200).json({
      resetPasswordOtp: otp,
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    console.log(otp, newPassword);
    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() },
    }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Otp Invalid or has been Expired" });
    }
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: `Password changed successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    console.log("in getAllUser");

    const keyward = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    console.log("User from req:", req.user);

    // const users = await User.find(keyward).find({ _id: { $ne: req.user._id } });
    const users = await User.find({ ...keyward, _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
