const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUser(req, res) {
  try {
    const followerId = req.user.id; // logged in user
    const followingId = req.params.userId;

    if (followerId === followingId)
      return res.status(400).json({ message: "You can't follow yourself" });

    const follow = await followModel.create({
      follower: followerId,
      following: followingId,
    });

    res.json({ success: true, follow });
  } catch (err) {
    res.status(500).json({ message: "Error following user" });
  }
}

async function unfollowUser(req, res) {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    await followModel.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error unfollowing user" });
  }
}

async function getMyFollowers(req, res) {
  try {
    const myId = req.user.id;

    const followers = await followModel
      .find({ following: myId })
      .populate("follower", "username profileImage");

    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching followers" });
  }
}

async function getMyFollowing(req, res) {
  try {
    const myId = req.user.id;

    const following = await followModel
      .find({ follower: myId })
      .populate("following", "username profileImage");

    res.json(following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following" });
  }
}

async function getSuggestions(req, res) {
  try {
    const myId = req.user.id;

    const followingIds = await followModel
      .find({ follower: myId })
      .distinct("following");

    const users = await userModel
      .find({
        _id: { $nin: [...followingIds, myId] },
      })
      .select("username profileImage");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function removeFollower(req, res) {
  try {
    const myId = req.user.id; // logged-in user
    const followerId = req.params.userId; // the person following me

    await followModel.findOneAndDelete({
      follower: followerId, // they follow me
      following: myId, // I am being followed
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//Later on

async function requestAcceptController(req, res) {
  const follow = await followModel.findOne({
    follower: req.params.username,
    following: req.user.username,
  });

  if (!follow) {
    return res.status(404).json({ message: "No follow request found" });
  }

  if (follow.requestStatus !== "pending") {
    return res.status(400).json({ message: "Request already handled" });
  }

  follow.requestStatus = "accepted";
  await follow.save();

  res.status(200).json({
    message: `${follow.follower} Request Accepted`,
  });
}

async function requestRejectController(req, res) {
  const follow = await followModel.findOne({
    follower: req.params.username,
    following: req.user.username,
  });

  if (!follow) {
    return res.status(404).json({ message: "No follow request found" });
  }

  if (follow.requestStatus !== "pending") {
    return res.status(400).json({ message: "Request already handled" });
  }

  follow.requestStatus = "rejected";
  await follow.save();

  res.status(200).json({
    message: `${follow.follower} Request Rejected`,
  });
}

module.exports = {
  followUser,
  unfollowUser,
  getMyFollowers,
  getMyFollowing,
  getSuggestions,
  requestAcceptController,
  requestRejectController,
  removeFollower,
};
