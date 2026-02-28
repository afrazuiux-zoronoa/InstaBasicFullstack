const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const imageKit = require("../config/imagekit");

async function registerController(req, res) {
  try {
    const { username, email, password, bio, profileImage } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExist) {
      if (isUserAlreadyExist.username === username)
        return res.status(400).json({ message: "Username already taken" });
      if (isUserAlreadyExist.email === email)
        return res.status(400).json({ message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      bio,
      profileImage,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User registered successfully",
      user: {
        username,
        email,
        bio,
        profileImage,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function loginController(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not exist, please resgister" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Password is wrong, please enter correct passowrd" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ message: `${user.username} has logged in successfully`, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      messsage: error.message,
    });
  }
}

async function logoutController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await blacklistModel.create({ token });
  }

  res.clearCookie("token");

  res.status(201).json({
    message: "Logout Succefully",
  });
}

async function updateProfileController(req, res) {
  const file = req.file;
  const user = req.user.id;

  let imageUrl;

  if (file) {
    const imageData = await imageKit.upload({
      folder: "cohort2/insta-basic/profilePicture",
      file: file.buffer,
      fileName: file.originalname,
    });

    imageUrl = imageData.url;
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    user,
    {
      username: req.body.username,
      ...(imageUrl && { profileImage: imageUrl }),
    },
    { returnDocument: "after" },
  );

  res.status(200).json({
    message: "User's Profile Updated succefully",
    user: updatedUser,
  });
}

module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutController,
  updateProfileController,
};
