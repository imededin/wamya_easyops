const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    backend: {
      backendType: {
        type: String,
        required: true,
        enum: ["NodeJs", "php", "springBoot", "python"],
      },
      backendFolder: {
        type: String,
        required: true,
      },
    },
    frontend: {
      frontendType: {
        type: String,
        required: true,
        enum: ["React", "Angular"],
      },
      frontendFolder: {
        type: String,
        required: true,
      },
    },
    gitRepo: {
      gitUrl: {
        type: String,
        required: true,
      },
      gitBranch: {
        type: String,
        required: true,
      },
    },

    infraType: {
      type: String,
      required: true,
    },
    dbType: {
      type: String,
      required: true,
    },
    infra: {
      type: Object,
      required: true,
    },
  },
  {
    collection: "deployment",
  }
);

module.exports = mongoose.model("Deployment", deploymentSchema);
