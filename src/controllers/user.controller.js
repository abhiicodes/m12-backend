const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const authMiddleware = require("../middlewares/auth.middleware");
require("dotenv").config();
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const pass = await argon2.hash(req.body.pass);

    const user = await User.create({
      email: req.body.email,
      pass,
      name: req.body.name,
    });

    return res.status(200).send({ message: "User created successfully", user });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const pass = await argon2.verify(user.pass, req.body.pass);
    if (!pass) {
      return res.status(500).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).send({ message: "Log in successfull", token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/getProfile", authMiddleware, async (req, res) => {
  console.log(req.body);

  try {
    const user = await User.findOne({ _id: req.body.user_id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    let obj = { name: user.name, email: user.email, id: user._id };

    return res.status(200).send({ message: "User found", user: obj });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/calculate", async (req, res) => {
  console.log(req.body);

  try {
    let { total, interest, years } = req.body;
    let i = interest / 100;

    let F = Math.floor(total * (((1 + i) ** years - 1) / i));
    let tia = total * years;
    let tig = F - tia;
    let data = {
      tmv: F,
      tia,
      tig,
    };

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
