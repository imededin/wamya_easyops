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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import Table from "react-bootstrap/Table";

import Button from "react-bootstrap/Button";

// Data
import data from "layouts/dashboard/components/Projects/data";
import axios from "axios";
import { Spinner, Badge } from "react-bootstrap";

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  const [projects, setProjects] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [updatingProjectId, setUpdatingProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects when the component mounts
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Make a GET request to the backend endpoint
      const response = await axios.get("/api/projects");

      // Set the projects in the state
      setProjects(response.data);
      console.log(response.data[0]._id);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  function handleUpdate(id) {
    console.log(id);
    setSubmitted(true);
    setUpdatingProjectId(id);
    axios({
      method: "POST",
      url: "/api/updateP",
      data: { id: id },
    })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status === "ok") {
          console.log("project updated");
          const buildNumber = res.data.buildInfo.buildNumber;
          console.log(buildNumber);
          navigate(`/updateView/${buildNumber}`);
        }
        if (res.data.status === "bad") {
          setSubmitted(false);
          alert(res.data.error);
        }
        // handle successful response from server
      })
      .catch((error) => {});
  }
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <MDTypography variant="h6" gutterBottom>
              Projects
            </MDTypography>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Version</th>
              <th>EndPoint</th>

              <th>
                <center>Action</center>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.jsonParam.projectName}</td>
                <td>
                  <Badge bg="success">v1.{project.jsonParam.versionNum}</Badge>
                </td>
                <td style={{ color: "blue", textDecoration: "underline", textAlign: "center" }}>
                  <a href={"http://" + project.endpoint} target="_blank">
                    http://{project.endpoint}
                  </a>
                </td>

                <td>
                  <center>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdate(project._id)}
                      disabled={updatingProjectId === project._id}
                    >
                      {submitted && updatingProjectId === project._id ? <Spinner /> : "Update"}
                      <Icon>update</Icon>
                    </button>{" "}
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/monitor/${project._id}`)}
                    >
                      Monitor <Icon>monitor</Icon>
                    </button>{" "}
                    <button className="btn btn-secondary">
                      Delete <Icon>delete</Icon>
                    </button>{" "}
                  </center>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MDBox>
    </Card>
  );
}

export default Projects;
