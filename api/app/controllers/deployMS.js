const mongoose = require("mongoose");
require("../models/deploymentMSchema");

const { Mutex } = require("async-mutex");
const { execSync } = require("child_process");
const multer = require("multer");

// Create a mutex object
const mutex = new Mutex();

const fs = require("fs");
const yaml = require("js-yaml");

const Jenkins = require("jenkins");
const WebSocket = require("ws");
const jenkinsUrl =
  process.env.JENKINS_URL || "http://jenkins:123456@172.176.170.82:8080";
const jenkins = new Jenkins({
  baseUrl: jenkinsUrl,
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

const DeployMS = mongoose.model("DeploymentMS");

async function triggerPipeline(params) {
  try {
    var pipelineParams;

    const { jsonParam, file, services } = params;
    const email = JSON.parse(jsonParam).email;
    const projectName = JSON.parse(jsonParam).projectName;
    console.log(email, projectName);
    if (file) {
      const fileData = fs.readFileSync(file.path);
      const base64File = fileData.toString("base64");
      console.log(fileData);

      // Construct the parameters for the pipeline
      pipelineParams = {
        jsonParam: jsonParam,
        file: base64File,
        services: services,
      };
    } else {
      pipelineParams = params;
    }
    console.log(pipelineParams);
    const info = await jenkins.job.build({
      name: "EasyOps-MS",
      parameters: pipelineParams,
    });
    execSync("sleep 10");
    const l = await jenkins.build.get("EasyOps-MS", "lastBuild");
    console.log(l.number);

    //const buildNum = info.data.executable;
    // console.log(buildNum);
    console.log(info);

    return JSON.stringify({
      email: email,
      projectName: projectName,
      buildNumber: l.number,
    });
  } catch (err) {
    console.error(err);
  }
}
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create an upload instance
const upload = multer({ storage: storage });

exports.deploy = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      const deployInfo = JSON.parse(req.body.data);
      const services = JSON.parse(req.body.services);
      const email = deployInfo["email"];
      const projectName = deployInfo["projectName"];
      const oldProject = await DeployMS.findOne({
        "jsonParam.projectName": projectName,
        "jsonParam.email": email,
      });
      if (oldProject) {
        console.log("pE");
        return res.json({ status: "bad", error: "projectName already used!" });
      }
      console.log(deployInfo["email"]);

      var params;
      if (err) {
        // Handle the error
        throw new Error(err.message);
      }

      if (req.file) {
        params = {
          jsonParam: JSON.stringify(deployInfo),
          file: req.file,
          services: JSON.stringify(services),
        };

        //console.log(params);
      } else if (
        !req.file &&
        deployInfo["infraType"] === "Existant K8S cluster"
      ) {
        // Handle the error
        throw new Error("File Not Found :(");
      } else {
        params = {
          jsonParam: JSON.stringify(deployInfo),
          services: JSON.stringify(services),
        };
        console.log(params);
      }

      const result = await triggerPipeline(params);
      if (result) {
        const ress = JSON.parse(result);
        console.log(ress);
        return res.json({ status: "ok", buildInfo: ress });
      }
      res.send({ status: "ok" });
    } catch (err) {
      console.log(err.message);
      // Handle the error and send response
      res.json({
        status: "bad",
        error: err.message,
      });
    }
  });
};
exports.addToDB = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      const deployInfo = JSON.parse(req.body.jsonParam);
      const services = JSON.parse(req.body.services);
      const endpoint = req.body.endpoint;
      const newProject = await DeployMS.create({
        jsonParam: deployInfo,
        endpoint: endpoint,
        services: services,
        file: {
          metadata: req.file,
          content: fs.readFileSync(req.file.path),
        },
      });
      res.json({ message: "Request received successfully & add to db" });
    } catch (err) {
      console.log(err);
    }
  });
};
