const express = require("express");

const postRouter = express.Router();

const upload = require("../middlewares/multer.middleware");

const {
  postCreateController,
  postFetchController,
  postFetchByIdController,
  likePostController,
  unlikePostController,
  getAllPostController,
} = require("../controllers/post.controller");

const isAuthenticated = require("../middlewares/auth.middleware");

postRouter.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  postCreateController,
);

postRouter.get("/", isAuthenticated, postFetchController);

postRouter.get("/byid/:postid", isAuthenticated, postFetchByIdController);

postRouter.post("/like/:postId", isAuthenticated, likePostController);

postRouter.post("/unlike/:postId", isAuthenticated, unlikePostController);

postRouter.get("/get-feed", isAuthenticated, getAllPostController);

module.exports = postRouter;
