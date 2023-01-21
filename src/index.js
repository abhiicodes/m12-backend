const connect = require("./configs/db");

const express = require("express");
const app = express();
const userController = require("./controllers/user.controller");

app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("", userController);
const PORT = 8080 || process.env.PORT;
app.listen(PORT, async () => {
  try {
    connect();
    console.log(`Listening to port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
