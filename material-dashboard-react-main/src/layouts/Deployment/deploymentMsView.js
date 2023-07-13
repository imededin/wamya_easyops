import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserContext from "../../context/userContext";
import { useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NotifContext from "context/notificationContext";

function DeploymentMsView() {
  const { buildNumber } = useParams();
  console.log(buildNumber);
  const location = useLocation();

  const [isConnected, setIsConnected] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userData = useContext(UserContext);
  const Navigate = useNavigate();
  const { success, projectName, setProjectName, toggleSuccess } = useContext(NotifContext);
  setProjectName(location.state.projectName);
  useEffect(() => {
    const url = `http://localhost:8082/api/deployMsV?email=${userData.email}&buildNumber=${buildNumber}`;
    const fetchLogs = async () => {
      try {
        const response = await fetch(url);
        const reader = response.body.getReader();
        let chunk = await reader.read();
        while (!chunk.done) {
          const data = new TextDecoder().decode(chunk.value);
          setLogEntries((prevEntries) => [...prevEntries, data]);
          if (data.includes("Finished: SUCCESS")) {
            toggleSuccess();

            Navigate("/");
            // Set the success flag to true if the expression is found in the logs
          }
          chunk = await reader.read();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isConnected && logEntries === undefined) {
        window.location.reload();
      }
    }, 10000); // Refresh the page every 10 seconds

    return () => clearInterval(intervalId);
  }, [logEntries, isConnected]);

  const MemoizedLogEntries = React.memo(() => {
    return (
      <div>
        {logEntries.map((logEntry, index) => (
          <div key={index}>
            <br />
            {logEntry}
          </div>
        ))}
      </div>
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isLoading && (
        <Card>
          <h1>Deployment in Progress </h1>

          <MemoizedLogEntries />
          <center>{!isConnected && <Spinner animation="border" variant="success" />}</center>
        </Card>
      )}
      {!isLoading && <MemoizedLogEntries />}
    </DashboardLayout>
  );
}

export default DeploymentMsView;
