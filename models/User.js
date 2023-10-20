const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema({
//   street: String,
//   city: String,
// });

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: {
      type: Number,
      min: 1,
      max: 100,
      validate: {
        validator: (v) => v % 2 === 0,
        message: (props) => `${props.value} is not an even number`,
      },
    },
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
