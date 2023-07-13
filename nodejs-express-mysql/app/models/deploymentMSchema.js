const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema(
  {
    jsonParam: {
      projectName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      versionNum: {
        type: Number,
        required: true,
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
        type: mongoose.Schema.Types.Mixed,
        required: true,
        strict: false,
      },
    },
    file: {
      metadata: {
        type: Object,
      },
      content: Buffer, // Define content field as Buffer type
    },
    services: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      strict: false,
    },
    endpoint: {
      type: String,
    },
  },
  {
    collection: "deployment",
  }
);

module.exports = mongoose.model("DeploymentMS", deploymentSchema);
