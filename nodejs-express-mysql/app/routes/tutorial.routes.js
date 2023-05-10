const tutorials = require("../controllers/account-controller.js");
const deployment = require("../controllers/deployment-controller.js");
const deployments = require("../controllers/deploy.js");
const deploymentsV = require("../controllers/deployView.js");
const express = require("express");
var router = require("express").Router();

// Create a new Tutorial
//router.post("/deploy", deployment.deploy);
router.post("/deploy", deployments.deploy);
router.get("/deployV", deploymentsV.deployView);
router.post("/register", tutorials.register);
router.post("/login", tutorials.login);
router.post("/userData", tutorials.userData);

// Retrieve all Tutorials
router.get("/", tutorials.hello);

// Retrieve all published Tutorials

module.exports = router;
