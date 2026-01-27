const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// 🔐 ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/user"));   // ✅ user + /user route

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
