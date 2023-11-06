const mongoose = require("mongoose");

// Define new schema for user model.
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      minLength: 10,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 10,
      required: true,
    },
    address: {
      street: String,
      city: String,
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { collection: "users" }
);

// Updates the updatedAt field before each save to user.
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);
