const userModel = require("../models/user.model");

async function isUserExist(req, res, next) {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(403).json({
        message: "You can't follow or unfollow yourself",
      });
    }

    const followeeExist = await userModel.findById(followingId);

    if (!followeeExist) {
      return res.status(404).json({
        message: "User does not exist!",
      });
    }

    // optional: attach target user
    req.targetUser = followeeExist;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = isUserExist;