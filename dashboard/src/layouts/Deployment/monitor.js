import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserContext from "../../context/userContext";
import { useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NotifContext from "context/notificationContext";
import axios from "axios";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";
import Table from "react-bootstrap/Table";
import { Badge } from "react-bootstrap";

function MonitorView() {
  const { id } = useParams();
  console.log(id);

  const [pods, setPods] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userData = useContext(UserContext);
  const Navigate = useNavigate();
  const { success, projectName, setProjectName, toggleSuccess } = useContext(NotifContext);
  useEffect(() => {
    axios({
      method: "GET",
      url: `/api/monitor?id=${id}`,
    })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status === "ok") {
          console.log("project added");
          console.log(res.data.services.items[0]);
          setPods(res.data.pods.items);
          setServices(res.data.services.items);
        }
        if (res.data.status === "bad") {
          console.log(res.data.error);
        }
        // handle successful response from server
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (pods === undefined) {
        window.location.reload();
      }
    }, 10000); // Refresh the page every 10 seconds

    return () => clearInterval(intervalId);
  }, []);
  const [selectedPS, setSelectedPS] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (pod) => {
    setSelectedPS(pod);
    setIsModalOpen(true);
  };
  const CustomDialog = React.forwardRef(function CustomDialog(props, ref) {
    return (
      <Modal.Dialog style={{ paddingTop: "50px" }} scrollable ref={ref}>
        {props.children}
      </Modal.Dialog>
    );
  });
  const PodModal = ({ pod, onClose }) => {
    console.log(pod);
    return (
      <Modal
        show={isModalOpen}
        onHide={onClose}
        onClose={onClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogAs={CustomDialog}
      >
        <Modal.Header>
          <Modal.Title>{pod.metadata.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{JSON.stringify(pod, null, 2)}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const Pods = () => {
    return (
      <Card>
        <MDBox>
          <h1>Pods</h1>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>status</th>
                <th>Ready</th>
                <th>Restart</th>
                <th>podIP</th>

                <th>
                  <center>Action</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {pods.map((pod, index) => (
                <tr key={index}>
                  <td>{pod.metadata.name}</td>
                  <td>
                    <Badge bg={pod.status.phase === "Running" ? "success" : "warning"}>
                      {pod.status.phase}
                    </Badge>
                  </td>
                  <td>
                    {" "}
                    <center>
                      {pod.status.conditions && pod.status.conditions[1]
                        ? pod.status.conditions[1].status
                        : null}
                    </center>
                  </td>
                  <td>
                    {" "}
                    <center>
                      {pod.status.containerStatuses && pod.status.containerStatuses[0]
                        ? pod.status.containerStatuses[0].restartCount
                        : null}
                    </center>
                  </td>
                  <td style={{ color: "blue", textDecoration: "underline", textAlign: "center" }}>
                    {pod.status.podIP}
                  </td>

                  <td>
                    <center>
                      <button className="btn btn-info" onClick={() => handleOpenModal(pod)}>
                        View full description <Icon>monitor</Icon>
                      </button>
                    </center>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </MDBox>
      </Card>
    );
  };
  const Services = () => {
    return (
      <Card>
        <MDBox>
          <h1>Services</h1>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>ClusterIp</th>
                <th>Selector</th>

                <th>
                  <center>Action</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc, index) => (
                <tr key={index}>
                  <td>{svc.metadata.name}</td>
                  <td>{svc.spec.type}</td>
                  <td style={{ color: "blue", textDecoration: "underline", textAlign: "center" }}>
                    {svc.spec.clusterIP}
                  </td>
                  <td
                    style={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {JSON.stringify(svc.spec.selector)}
                  </td>

                  <td>
                    <center>
                      <button className="btn btn-info" onClick={() => handleOpenModal(svc)}>
                        View full description <Icon>monitor</Icon>
                      </button>
                    </center>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </MDBox>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isModalOpen && <PodModal pod={selectedPS} onClose={() => setIsModalOpen(false)} />}

      <MDBox>
        <Grid container spacing={10}>
          <Grid item xs={12} md={6} lg={12}>
            <Pods />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <Services />
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default MonitorView;
