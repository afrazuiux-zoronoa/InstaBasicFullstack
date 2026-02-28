const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required for Black Listing"],
    },
  },
  {
    timestamps: true,
  },
);

const blacklistModel = mongoose.model("BlackList", blacklistSchema);

module.exports = blacklistModel;
