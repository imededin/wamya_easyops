const tutorials = require("../controllers/account-controller.js");
const deployment = require("../controllers/deployment-controller.js");
const deployments = require("../controllers/deploy.js");
const deploymentsMS = require("../controllers/deployMS.js");
const deploymentsV = require("../controllers/deployView.js");
const deploymentMsV = require("../controllers/deploymentMsView.js");
const projects = require("../controllers/projects-controller.js");
const updates = require("../controllers/update.js");
const updatesV = require("../controllers/updateView.js");
const monitor = require("../controllers/monitor.js");
const express = require("express");
var router = require("express").Router();

// Create a new Tutorial
//router.post("/deploy", deployment.deploy);
router.post("/deploy", deployments.deploy);
router.post("/deployMS", deploymentsMS.deploy);
router.post("/addToDB", deployments.addToDB);
router.post("/addMpToDB", deploymentsMS.addToDB);
router.post("/updateP", updates.update);
router.get("/deployV", deploymentsV.deployView);
router.get("/deployMsV", deploymentMsV.deployView);
router.get("/updateV", updatesV.updateView);
router.get("/monitor", monitor.monitor);

//user account
router.post("/register", tutorials.register);
router.post("/login", tutorials.login);
router.post("/userData", tutorials.userData);

// Retrieve all projects
router.get("/hello", tutorials.hello);
router.get("/projects", projects.getProjects);

// Retrieve all published Tutorials

module.exports = router;
