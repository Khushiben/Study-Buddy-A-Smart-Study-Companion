const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const { Server } = require("socket.io");
require("dotenv").config();
const registerStudyCircleSocket = require("./socket/studyCircleSocket");

const app = express();
const server = http.createServer(app);

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

registerStudyCircleSocket(io);
app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/flashcards", require("./routes/flashcardsApi"));
app.use("/api/deadlines", require("./routes/deadlineRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api", require("./routes/progress"));
app.use("/api/study-circle", require("./routes/studyCircle"));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please stop the running process or set PORT to another value.`);
    process.exit(1);
  }
  console.error(err);
});