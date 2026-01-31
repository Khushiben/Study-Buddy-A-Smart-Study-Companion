const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    default: "General", // 👈 important
  },
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);
