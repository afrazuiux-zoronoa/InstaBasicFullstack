const express = require("express");

const app = express();

// Imports
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const followRouter = require("./routes/user.routes");
const cors = require("cors");

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/users", followRouter);

module.exports = app;
