const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");


const imageKit = require("../config/imagekit");

async function postCreateController(req, res) {
  try {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageData = await imageKit.upload({
      folder: "cohort2/insta-basic/post",
      file: file.buffer,
      fileName: file.originalname,
    });

    const post = await postModel.create({
      caption,
      imageUrl: imageData.url,
      user: req.user.id,
    });

    res.status(200).json({
      message: "Post created Succefully 🎉",
      post,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function postFetchController(req, res) {
  try {
    const allPosts = await postModel.find({
      user: req.user.id,
    });

    res.status(201).json({
      message: "Your all posts fetched successfully",
      allPosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function postFetchByIdController(req, res) {
  try {
    const postId = req.params.postid;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isValidUser = req.user.id === post.user.toString();

    if (!isValidUser) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    res.status(201).json({
      message: "Your post fetched successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function likePostController(req, res) {
  try {
    const user = req.user.username;
    const post = req.params.postId;

    const postExist = await postModel.findById(post);

    if (!postExist) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const liked = await likeModel.findOne({
      user,
      post,
    });

    if (liked) {
      return res.status(400).json({
        message: "You already liked this post",
        liked,
      });
    }

    const newLike = await likeModel.create({
      user,
      post,
    });

    res.status(201).json({
      message: "You liked this post",
      newLike,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function unlikePostController(req, res) {
  try {
    const user = req.user.username;
    const post = req.params.postId;

    const postExist = await postModel.findById(post);

    if (!postExist) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const deleted = await likeModel.findOneAndDelete({ user, post });

    if (!deleted) {
      return res.status(400).json({
        message: "Post not liked yet",
      });
    }

    res.status(201).json({
      message: "You unliked this post",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllPostController(req, res) {
  const posts = await postModel.find().populate("user").lean();

  const feed = await Promise.all(
    posts.map(async (post) => {
      const isLiked = await likeModel.findOne({
        user: req.user.username,
        post: post._id,
      });

      post.isLiked = !!isLiked;
      return post;
    }),
  );

  res.status(200).json({
    message: "Feed fetched successfully",
    feed,
  });
}

module.exports = {
  postCreateController,
  postFetchController,
  postFetchByIdController,
  likePostController,
  unlikePostController,
  getAllPostController,
};
