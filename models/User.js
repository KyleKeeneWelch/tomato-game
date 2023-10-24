const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema({
//   street: String,
//   city: String,
// });

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

// pre before, post after
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// userSchema.post("save", function (doc, next) {
//   this.sayHi();
//   next();
// });

module.exports = mongoose.model("User", userSchema);
