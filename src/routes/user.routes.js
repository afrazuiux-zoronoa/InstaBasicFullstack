const express = require("express");

const followRouter = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");

const {
  followUser,
  unfollowUser,
  getMyFollowers,
  getMyFollowing,
  getSuggestions,
  removeFollower
} = require("../controllers/follow.controller");

const isUserExist = require("../middlewares/userexist.middleware");

followRouter.post("/follow/:userId", isAuthenticated, isUserExist, followUser);
followRouter.delete(
  "/unfollow/:userId",
  isAuthenticated,
  isUserExist,
  unfollowUser,
);
followRouter.get("/followers", isAuthenticated, getMyFollowers);
followRouter.get("/following", isAuthenticated, getMyFollowing);
followRouter.get("/suggestions", isAuthenticated, getSuggestions);
followRouter.delete("/remove-follower/:userId", isAuthenticated, removeFollower);

module.exports = followRouter;
