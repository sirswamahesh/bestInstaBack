const { Server } = require("socket.io");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cookieParser = require("cookie-parser");
const { app, server } = require("./app");

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);

server.listen(process.env.PORT, () => {
  try {
    console.log(`Server listen at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
