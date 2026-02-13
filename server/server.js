const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});