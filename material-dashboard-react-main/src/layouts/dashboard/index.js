/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import UserContext from "../../context/userContext";
import React, { useContext, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import NotifContext from "context/notificationContext";
import MDSnackbar from "components/MDSnackbar";
import axios from "axios";
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const userData = useContext(UserContext);
  const { success, projectName, toggleSuccess } = useContext(NotifContext);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={`Project ${projectName}`}
      content="Please check your mail to view deployment status!"
      dateTime="Now"
      open={success}
      onClose={toggleSuccess}
      close={!success}
    />
  );
  const [projects, setProjects] = useState([]);
  const [awsCount, setAwsCount] = useState(0);
  const [azureCount, setAzureCount] = useState(0);
  const [vmCount, setVmCount] = useState(0);

  const fetchProjects = async () => {
    try {
      // Make a GET request to the backend endpoint
      const response = await axios.get("http://localhost:8082/api/projects");

      // Set the projects in the state
      setProjects(response.data);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const statistics = async () => {
    try {
      let awsCount = 0;
      let azureCount = 0;
      let vmCount = 0;

      projects.forEach((project) => {
        const infraType = project.jsonParam.infraType;
        if (infraType === "AWS EKS") {
          awsCount++;
        } else if (infraType === "AZURE AKS" || infraType === "Existant K8S cluster") {
          azureCount++;
        } else if (infraType === "Existant VM") {
          vmCount++;
        }
      });

      setAwsCount(awsCount);

      setAzureCount(azureCount);

      setVmCount(vmCount);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  useEffect(() => {
    statistics();
  }, [projects]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <h3>
        hello <span style={{ color: "green" }}>{userData.fname}</span>
      </h3>
      {renderSuccessSB}
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                title="Aws EKS"
                count={awsCount}
                percentage={{
                  color: "success",
                  amount: (awsCount / projects.length) * 100 + "%",
                  label: "of total projects",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Azure AKS"
                count={azureCount}
                percentage={{
                  color: "success",
                  amount: (azureCount / projects.length) * 100 + "%",
                  label: "of total projects",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="VM"
                count={vmCount}
                percentage={{
                  color: "success",
                  amount: (vmCount / projects.length) * 100 + "%",
                  label: "of total projects",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <MDBox mb={8} position="absolute">
                <MDButton
                  component="a"
                  onClick={() => {
                    window.location.href = "/project";
                  }}
                  target="_blank"
                  rel="noreferrer"
                  size="large"
                  variant="gradient"
                  fullWidth
                  color="success"
                  position="center"
                  background="blue"
                >
                  Quick start
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid>
            <Grid item xs={10} md={8} lg={8}>
              <MDBox mb={6}></MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
