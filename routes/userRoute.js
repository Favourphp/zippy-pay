const express = require("express");
const router = express.Router();
const requireToken = require("../middlewares/verifyToken");

const {
  registerController,
  loginController,
  verifyController,
  forgetPassword,
  resetPassword,
  logout,
  getProfile,
} = require("../controller/authentication/userController");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/confirm/:userID", verifyController);
router.get("/profile", requireToken, getProfile);
//router.put("/profile", editProfile)
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/logout", logout);

module.exports = router;
