const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    require: [
      true,
      "Image is require, cuz then there will be nothing to upload right?",
    ],
  },
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Wihout user ID you cannot create a post"],
  },
}, {
  timestamps: true,
});

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
