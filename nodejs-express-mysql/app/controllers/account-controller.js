
require("../models/userDetails");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";



exports.hello = (req, res) => {
  res.send('hello world');
};




const mongoUrl =  process.env.MONGO_DB_URL ||"mongodb://root:example@127.0.0.1:27017/admin"
 // "mongodb://root:example@127.0.0.1:27017/admin"//?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));



 
const User = mongoose.model("UserInfo");

// Create and Save a new Tutorial

exports.register = async (req, res) => {
  //alert("hello")
  console.log(req.body);
  const { fname, Cname, email, password } = req.body;
  console.log(fname)

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      Cname,
      email,
      password: encryptedPassword,
     
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.log(error)
    res.send({ status: "error" });
  }
}
exports.login= async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "300s",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
};
exports.userData = async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
};
 