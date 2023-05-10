import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserContext from "../../context/userContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

function DeploymentView() {
  const { buildNumber } = useParams();
  console.log(buildNumber);
  const [isConnected, setIsConnected] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userData = useContext(UserContext);

  useEffect(() => {
    const url = `http://localhost:8082/api/deployV?email=${userData.email}&projectName=test&buildNumber=${buildNumber}`;
    const fetchLogs = async () => {
      try {
        const response = await fetch(url);
        const reader = response.body.getReader();
        let chunk = await reader.read();
        while (!chunk.done) {
          const data = new TextDecoder().decode(chunk.value);
          setLogEntries((prevEntries) => [...prevEntries, data]);
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
            <h6>{logEntry}</h6>
          </div>
        ))}
      </div>
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <h1>Deployment in Progress ...</h1>
        {!isConnected && <Spinner animation="border" variant="success" />}

        <MemoizedLogEntries />
      </Card>
    </DashboardLayout>
  );
}

export default DeploymentView;
