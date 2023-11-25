const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const short = require("short-uuid");
// const forgetPasswordEmail = require("../../config/mailTransport");
const {
  sendConfirmationEmail,
  forgetPasswordEmail,
} = require("../../config/mailTransport");

//=========================Register user=======================================
const registerController = async (req, res) => {
  try {
    // const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);

    const {
      name,
      phoneNumber,
      email,
      password,
    } = req.body;

    //Check if user with the same email already exists
    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    if (password !== password) {
      return res.status(400).json({
        message: "the passwords do not match",
      });
    }
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate password reset token
    const confirmationCode = Math.ceil(Math.random() * 5000); // 73WakrfVbNJBaAmhQtEeDv
    console.log(confirmationCode);
    // Create and save a new user
    const user = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      confirmationCode: confirmationCode,
    });
    console.log(user._id.toString());
    const userID = user._id.toString();
    sendConfirmationEmail(
      req.headers.host,
      user.name,
      user.email,
      user.confirmationCode,
      userID
    );

    // Return a success response
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    // Handling errors
    console.error("Error registering user: ", error);
    return res.status(500).json({
      message: "An error occurred during registration",
      error: error,
    });
  }
};

//================ Verify controller ===========================
const verifyController = async (req, res) => {
  try {
    const { userID } = req.params;
    const { confirmationCode } = req.body;
    const user = await User.findOne({
      _id: userID,
    });
    console.log(user, userID)

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    if (confirmationCode === user.confirmationCode) {
      user.status = "Active";
      await user.save();

      return res.status(200).json({ message: "User successfully verified" });
    }
    return res.status(401).json({ message: "Invalid Code" });
  } catch (error) {
    console.error("Error verifying user: ", error);
    res.status(500).json({ message: "An error occurred while verifying" });
  }
};

//================== LOGIN USER =======================
const loginController = async (req, res) => {
  const { email, password } = req.body;
  // Generate password reset token
  // const confirmationCode = short.generate(); // 73WakrfVbNJBaAmhQtEeDv

  try {
    const foundUser = await User.findOne({
      email: email,
    });

    //check verification
    if (foundUser.status !== "Active") {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email",
      });
    }

    if (!foundUser) {
      res.status(404).json({
        message: "Invalid Credentials - User not found",
      }); //in production, only 'Invalid Credentials'
    }

    const checkPassword = await bcrypt.compare(password, foundUser.password);

    if (!checkPassword) {
      res.status(401).json({
        message: "Invalid Credentials - Wrong password",
      }); //in production, only 'Invalid Credentials'
    } else {
      const token = jwt.sign(
        {
          userId: foundUser._id,
          email: foundUser.email,
         name: foundUser.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1hr",
        }
      );

      return res.status(200).json({
        message: "Welcome",
        token: token, //3456, // TODO GENERATE A TOKEN - DONE
        user: foundUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error While Trying To Login, Try Again",
    });
  }
};
//================ FORGET PASSWORD ===============
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //Check if user with the given email existst
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json({
        error: `User with email '${email}' is not found`,
      });
    }

    // Generate password reset token
    const resetToken = short.generate(); // 73WakrfVbNJBaAmhQtEeDv

    // Save the reset token and expiration time in the userModel
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // console.log(req.headers.host);

    // Send the password reset email
    forgetPasswordEmail(req.headers.host, user.firstName, email, resetToken);

    // Return a success response
    return res.status(200).json({
      message: "Password Reset Email send...",
    });
  } catch (error) {
    console.error("Error sending password reset email", error);
    res.status(500).son({
      error: "An error occur while sending the mail",
    });
  }
};
//==================== RESET PASSWORD =====================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);
    const { password } = req.body;

    // Find the user by the reset token and ensure it is not expires
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    // if no user found or token expired
    if (!user) {
      return res.status(400).json({
        error: "invalid or expired toke",
      });
    }

    // update the users password and clear the reset password token field
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfull!",
    });
  } catch (error) {
    console.error("Error resetting password", error);
    res.status(500).json({
      error: "An error occurred while reseting the password!",
    });
  }
};
//================= LOG OUT USER ======================
const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });

  return res.json({
    message: "user logged out",
  });
};
//================ GET USER ====================
const getProfile = async (req, res) => {
  console.log(req.user);
  const userID = req.user.email;
  console.log(userID);

  try {
    const user = await User.findOne({ email: userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching profile" });
  }
};

//================== EDIT USER================
const editProfile = async (req, res) => {
  const userID = req.user._id;

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;

    await user.save();

    res.status(200).json({ message: "Profile Updated Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error while updating profile" });
  }
};

module.exports = {
  loginController,
  registerController,
  verifyController,
  forgetPassword,
  resetPassword,
  logout,
  getProfile,
  editProfile,
};
