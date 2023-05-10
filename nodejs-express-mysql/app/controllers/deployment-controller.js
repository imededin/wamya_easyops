const mongoose = require("mongoose");
require("../models/deploymentSchema");

const { Mutex } = require("async-mutex");

// Create a mutex object
const mutex = new Mutex();

const fs = require("fs");
const yaml = require("js-yaml");

const Jenkins = require("jenkins");
const WebSocket = require("ws");

const jenkins = new Jenkins({
  baseUrl: "http://jenkins:123456@localhost:8080",
});
const wss = new WebSocket.Server({ port: 9010 });
const connections = [];

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  // Add the WebSocket connection to the array
  connections.push(ws);

  // Remove the WebSocket connection from the array when it is closed
  ws.on("close", () => {
    const index = connections.indexOf(ws);
    if (index >= 0) {
      connections.splice(index, 1);
    }
  });
});
const { execSync } = require("child_process");

async function triggerPipeline(params) {
  try {
    const info = await jenkins.job.build({
      name: "EasyOps",
      parameters: params,
    });

    const deployInfo = JSON.parse(params.jsonParam).email;
    console.log(deployInfo);
    execSync("sleep 10");
    const buildNum = info.data;
    console.log(buildNum);

    const wsPath = `/${deployInfo}`;
    const ws = new WebSocket(`ws://localhost:9010${wsPath}`);

    ws.on("open", () => {
      console.log(`WebSocket connection to ${ws.url} established`);
    });

    ws.on("close", (event) => {
      console.log(
        `WebSocket connection to ${ws.url} closed with code ${event.code}`
      );
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error: ${error.message}`);
    });

    ws.on("message", (message) => {
      console.log(`WebSocket message received: ${message}`);
    });

    const logStream = jenkins.build.logStream("EasyOps", "lastBuild");
    logStream.on("data", (text) => {
      const logEntry = {
        message: text,
      };
      console.log(text);
      console.log(connections.length);
      connections.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(logEntry));
        }
      });
    });

    logStream.on("error", (err) => {
      console.error(`Log stream error: ${err}`);
      ws.close();
    });

    logStream.on("end", () => {
      console.log(`Log stream for build ${buildNumber} ended`);
      ws.close();
    });

    console.log(info);
  } catch (err) {
    console.error(err);
  }
}

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

exports.deploy = async (req, res) => {
  //alert("hello")
  try {
    //console.log(req);
    const deployInfo = req.body;
    const params = {
      jsonParam: JSON.stringify(deployInfo),
    };

    const release = await mutex.acquire();
    try {
      // Critical section
      await triggerPipeline(params);
    } finally {
      // Release the lock
      release();
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

    // const yamlStr = yaml.dump(deployInfo);
    // const fileName = `${email}-${projectName}.yaml`;

    //fs.writeFileSync(fileName, yamlStr);
    //triggerPipeline(params);
    const newProject = await Deploy.create(deployInfo);
    //triggerPipeline(params);
    // add deployment info to database
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "bad", error: error.message });
  }
};
