const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already exist"],
    require: [true, "username is required"],
  },
  email: {
    type: String,
    unique: [true, "email address already exist"],
    require: [true, "email address is required"],
  },
  password: {
    type: String,
    require: [true, "password is required"],
    select: false,
  },
  bio: {
    type: String,
  },
  profileImage: {
    type: String,
    default:
      "https://i.pinimg.com/736x/0d/7a/94/0d7a942e8674a5d7feb1bbc630f5f964.jpg",
  },
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
