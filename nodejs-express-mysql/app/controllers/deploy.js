const mongoose = require("mongoose");
require("../models/deploymentSchema");

const { Mutex } = require("async-mutex");
const { execSync } = require("child_process");

// Create a mutex object
const mutex = new Mutex();

const fs = require("fs");
const yaml = require("js-yaml");

const Jenkins = require("jenkins");
const WebSocket = require("ws");

const jenkins = new Jenkins({
  baseUrl: "http://jenkins:123456@localhost:8080",
});
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

async function triggerPipeline(params) {
  try {
    const info = await jenkins.job.build({
      name: "EasyOps",
      parameters: params,
    });
    execSync("sleep 10");
    const l = await jenkins.build.get("EasyOps", "lastBuild");
    console.log(l.number);

    //const buildNum = info.data.executable;
    // console.log(buildNum);
    console.log(info);

    return JSON.stringify({
      email: "test@gmail.com",
      projectName: "blabla@gma",
      buildNumber: l.number,
    });
  } catch (err) {
    console.error(err);
  }
}

exports.deploy = async (req, res) => {
  try {
    //const deployInfo = req.body;
    const deployInfo = req.body;
    const params = {
      jsonParam: JSON.stringify(deployInfo),
    };
    const result = await triggerPipeline(params);
    if (result) {
      const ress = JSON.parse(result);
      console.log(ress);
      return res.json({ status: "ok", buildInfo: ress });
    }
    console.log(deployInfo);
    const email = deployInfo["email"];
    const projectName = deployInfo["projectName"];

    console.log(projectName);
    const oldProject = await Deploy.findOne({ projectName, email });

    if (oldProject) {
      console.log("pE");
      return res.json({ status: "bad", error: "projectName already used!" });
    }

    //const newProject = await Deploy.create();
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "bad", error: error.message });
  }
};
