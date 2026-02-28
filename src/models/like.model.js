const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: {
    type: String,
    require: [true, "Wihout user ID you cannot like a post"],
  },
  post: {
    ref: "posts",
    type: mongoose.Schema.Types.ObjectId,
    require: [true, "Wihout post ID you cannot like a post"],
  },
});

likeSchema.index({ user: 1, post: 1 }, { unique: true });

const likeModel = mongoose.model("like", likeSchema);

module.exports = likeModel;
