const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    name: { type: String, required: true },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = new mongoose.model("user", userSchema);
