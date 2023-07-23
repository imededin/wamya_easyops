const { KubeConfig } = require("kubernetes-client");
const kubeconfig = new KubeConfig();

const Request = require("kubernetes-client/backends/request");
const Client = require("kubernetes-client").Client;

const mongoose = require("mongoose");
require("../models/deploymentSchema");

const { Mutex } = require("async-mutex");
const { execSync } = require("child_process");

// Create a mutex object
const mutex = new Mutex();

const fs = require("fs");
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

exports.monitor = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split("?")[1]);

    const id = params.get("id");

    const Deployment = await Deploy.findById(id);

    if (!Deployment) {
      // Handle the case when no deployment is found with the given ID
      console.log("Deployment not found");
      return;
    }
    await fs.writeFileSync(
      "public/tmp/kubeConfig",
      Deployment.file.content.toString()
    );
    kubeconfig.loadFromFile("public/tmp/kubeConfig");
    const backend = new Request({ kubeconfig });
    const client = new Client({ backend, version: "1.13" });

    const pods = await client.api.v1
      .namespaces(`${Deployment.jsonParam.projectName}`)
      .pods.get();
    const services = await client.api.v1
      .namespaces(`${Deployment.jsonParam.projectName}`)
      .services.get();
    console.log(client.apis);

    res.json({ pods: pods.body, services: services.body, status: "ok" });
    fs.unlink("public/tmp/kubeConfig", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File deleted successfully");
    });
  } catch (err) {
    console.log(err.message);
  }

  //console.log(namespaces.body);
};
