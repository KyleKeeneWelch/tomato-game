const mongoose = require("mongoose");

// Define new schema for score model.
const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    score: {
      type: Number,
      min: 0,
      max: 500,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
  { collection: "scores" }
);

module.exports = mongoose.model("Score", scoreSchema);
