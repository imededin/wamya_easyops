const mongoose = require("mongoose");
require("../models/deploymentSchema");

const { Mutex } = require("async-mutex");
const { execSync } = require("child_process");

// Create a mutex object
const mutex = new Mutex();

const fs = require("fs");
const yaml = require("js-yaml");

const Jenkins = require("jenkins");

const jenkinsUrl =
  process.env.JENKINS_URL || "http://jenkins:123456@127.0.0.1:8080";
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
const Deploy = mongoose.model("Deployment");

async function triggerPipeline(params) {
  try {
    console.log(params);

    const info = await jenkins.job.build({
      name: "easyops-update",
      parameters: params,
    });
    execSync("sleep 10");
    const l = await jenkins.build.get("easyops-update", "lastBuild");
    console.log(l.number);

    console.log(info);

    return JSON.stringify({
      buildNumber: l.number,
    });
  } catch (err) {
    console.error(err);
  }
}

exports.update = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    var pipelineParams;
    const updatedDeployment = await Deploy.findByIdAndUpdate(
      id,
      { $inc: { "jsonParam.versionNum": 1 } },
      { new: true }
    );

    if (!updatedDeployment) {
      // Handle the case when no deployment is found with the given ID
      console.log("Deployment not found");
      return;
    }

    // Extract the necessary fields
    const {
      jsonParam,
      file: { content },
    } = updatedDeployment;

    // Prepare the pipelineParams object
    pipelineParams = {
      jsonParam: JSON.stringify(jsonParam),
      file: content.toString("base64"),
    };

    // Handle the result of the pipeline trigger

    //console.log("Pipeline Params:", pipelineParams);
    const result = await triggerPipeline(pipelineParams);
    if (result) {
      const ress = JSON.parse(result);
      console.log(ress);
      return res.json({ status: "ok", buildInfo: ress });
    }

    //res.send({ status: "ok" });
  } catch (err) {
    console.log(err.message);
    // Handle the error and send response
    res.json({
      status: "bad",
      error: err.message,
    });
  }
};
