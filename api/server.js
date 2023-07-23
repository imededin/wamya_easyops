const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const bodyParser = require("body-parser");
const fs = require("fs");
app.use(express.json());

app.get("/file/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  fs.readFile(fileName, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
});

const wiki = require("./app/routes/tutorial.routes");

app.use("/api", wiki);

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
