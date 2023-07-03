const mongoose = require("mongoose");
require("../models/deploymentSchema");
const mongoUrl =
  process.env.MONGO_DB_URL || "mongodb://root:example@127.0.0.1:27017/admin";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));
const Deploy = mongoose.model("Deployment");
exports.getProjects = async (req, res) => {
  try {
    const projects = await Deploy.find();

    // Send the projects as a JSON response
    res.json(projects);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal server error" });
  }
};
