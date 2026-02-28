const express = require("express");

const authRouter = express.Router();
const update = require("../middlewares/multer.middleware");

const {
  registerController,
  loginController,
  getMeController,
  logoutController,
  updateProfileController,
} = require("../controllers/auth.controller");

const isAuthenticated = require("../middlewares/auth.middleware");

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);

authRouter.get("/get-me", isAuthenticated, getMeController);

authRouter.get("/logout", logoutController);

authRouter.put(
  "/update-profile",
  isAuthenticated,
  update.single("profileImage"),
  updateProfileController,
);

module.exports = authRouter;
