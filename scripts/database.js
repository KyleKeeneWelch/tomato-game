const mongoose = require("mongoose");
const User = require("../models/User");
const Score = require("../models/Score");

class Database {
  connect() {
    mongoose
      .connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.hbxg6p5.mongodb.net/tomato-game?retryWrites=true&w=majority`
      )
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async findHighScores() {
    try {
      return await Score.find()
        .sort({ score: -1 })
        .limit(10)
        .select({ _id: 0, user: 1, score: 1, createdAt: 1 });
    } catch (e) {
      console.log(e);
    }
  }

  async findOneUser(query) {
    try {
      return await User.findOne(query);
    } catch (e) {
      console.log(e);
    }
  }

  async findById(Id) {
    try {
      return await User.findById(Id);
    } catch (e) {
      console.log(e);
    }
  }

  async create(doc, collection) {
    try {
      let model;
      if (collection == "users") {
        model = User;
      } else if (collection == "scores") {
        model = Score;
      }
      await model.create(doc);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Database;
