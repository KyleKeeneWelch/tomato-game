const mongoose = require("mongoose");
const User = require("../models/User");

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

  async findOne(query, collection, options = {}) {
    try {
      let model;
      if (collection == "users") {
        model = User;
      }
      return await model.findOne(query, options);
    } catch (e) {
      console.log(e);
    }
  }

  async findById(Id, collection) {
    try {
      let model;
      if (collection == "users") {
        model = User;
      }
      return await model.findById(Id);
    } catch (e) {
      console.log(e);
    }
  }

  async create(doc, collection) {
    try {
      let model;
      if (collection == "users") {
        model = User;
      }
      await model.create(doc);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Database;
