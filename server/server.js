const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS config (unchanged)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ JSON parsing
app.use(express.json());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// 🔐 ROUTES (unchanged)
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/user")); // ✅ user + /user route
app.use("/api/tasks", require("./routes/tasks")); // ✅ tasks route added

// ✅ Flashcards route (JWT protected internally)
app.use("/api/flashcards", require("./routes/flashcardsApi"));

// ✅ Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
