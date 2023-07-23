import { Form, Row, Col, Card, Button, Spinner, Table } from "react-bootstrap";
import Icon from "@mui/material/Icon";

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserContext from "../../context/userContext";
import axios from "axios";

import { Divider, Typography } from "antd";

function MsDeploy() {
  const { userData, setUserData } = useContext(UserContext);

  const [infraType, setInfraType] = useState("");
  console.log(userData, userData.email);
  const [formData, setFormData] = useState({ email: userData.email, versionNum: 0 });

  const renderFormFields = () => {
    switch (infraType) {
      case "AZURE AKS":
        return (
          <>
            <Form.Group>
              <Form.Label>Azure subscription ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="AZURE subscription ID"
                name="azureSubscriptionId"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Azure tenant ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="AZURE tenant ID"
                name="azureTenantId"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Azure app ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="AZURE app ID"
                name="azureAppId"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Azure app password</Form.Label>
              <Form.Control
                type="password"
                placeholder="AZURE app password"
                name="azureAppPass"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
          </>
        );
      case "AWS EKS":
        return (
          <>
            <Form.Group>
              <Form.Label>AWS access_key</Form.Label>
              <Form.Control
                type="text"
                placeholder="access_key"
                name="awsAccessKey"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>AWS secret_key</Form.Label>
              <Form.Control
                type="password"
                placeholder="secret_key"
                name="awsSecretKey"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
          </>
        );
      case "Existant K8S cluster":
        return (
          <>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>KubeConfig file</Form.Label>
              <Form.Control
                type="file"
                name="kubeConfigFile"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
                required
              />
            </Form.Group>
          </>
        );
      case "Existant VM":
        return (
          <>
            <Form.Group>
              <Form.Label>Server Url</Form.Label>
              <Form.Control
                type="text"
                placeholder="Server Url"
                name="serverUrl"
                onChange={(e) => handleFieldOnChange("infra", e)}
                onPaste={(e) => handleFieldOnChange("infra", e)}
              />
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };

  const handleInfraTypeChange = (e) => {
    setInfraType(e.target.value);
    setFormData({
      ...formData,
      infraType: e.target.value,
      email: userData.email,
    });
  };

  const handleFormOnChange = (e) => {
    if (e.type === "change") {
      const { name, value } = e.target;
      const lowercaseValue = name === "projectName" ? value.toLowerCase() : value;
      setFormData({
        ...formData,
        [name]: lowercaseValue,
      });
    } else if (e.type === "paste") {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData.getData("text");
      const name = e.target.name;
      const lowercaseValue = name === "projectName" ? pastedText.toLowerCase() : pastedText;

      setFormData({
        ...formData,
        [name]: lowercaseValue,
      });
    }
  };
  const handleFieldOnChange = (field, e) => {
    if (e.type === "change") {
      const { name, value, files } = e.target;
      if (name === "kubeConfigFile") {
        setFormData({
          ...formData,
          [field]: {
            ...formData[field],
            [name]: files[0],
          },
        });
      } else {
        setFormData({
          ...formData,
          [field]: {
            ...formData[field],
            [name]: value,
          },
        });
      }
    } else if (e.type === "paste") {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData.getData("text");
      const name = e.target.name;
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [name]: pastedText,
        },
      });
    }
  };
  console.log(formData);

  const [error, setError] = useState("");
  const [submited, setSubmited] = useState(false);
  const [IsError, setIsError] = useState(false);
  const [services, setServices] = useState([
    {
      name: "frontend",
      folder: "",
      type: "",
      withEnvVars: false,
      envVars: [{ name: "", value: "" }],
    },
  ]);

  const handleAddService = () => {
    setServices([
      ...services,
      { name: "", folder: "", type: "", withEnvVars: false, envVars: [{ name: "", value: "" }] },
    ]);
  };
  const handleToggleEnvVars = (index) => {
    const updatedService = [...services];
    updatedService[index].withEnvVars = !updatedService[index].withEnvVars;
    setServices(updatedService);
  };
  const handleAddEnvVar = (index) => {
    const updatedService = [...services];
    updatedService[index].envVars.push({ name: "", value: "" });
    setServices(updatedService);
  };
  const handleEnvVarChange = (svcIndex, varIndex, field, e) => {
    const updatedService = [...services];
    updatedService[svcIndex].envVars[varIndex][field] = e.target.value;
    setServices(updatedService);
  };
  const handleServiceChange = (index, field, e) => {
    const updatedService = [...services];
    if (index !== 0 || field !== "name") {
      updatedService[index][field] =
        field === "name" ? e.target.value.toLowerCase() : e.target.value;
      setServices(updatedService);
    }
  };
  console.log(services);

  const renderVars = (vars, section) => {
    return (
      <>
        {vars.map((envVar, index) => (
          <Row key={index} style={{ marginTop: 20 }}>
            <Col>
              <Form.Control
                type="text"
                placeholder="Name"
                value={envVar.name}
                onChange={(e) => handleEnvVarChange(section, index, "name", e)}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Value"
                value={envVar.value}
                onChange={(e) => handleEnvVarChange(section, index, "value", e)}
              />
            </Col>
          </Row>
        ))}

        <Button variant="secondary" onClick={() => handleAddEnvVar(section)}>
          Add Var
        </Button>
      </>
    );
  };

  const renderService = (services, section) => {
    return (
      <>
        {services.map((svc, index) => (
          <React.Fragment key={index}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>service name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="microservice name"
                    value={index === 0 ? "frontend" : svc.name}
                    readOnly={index === 0}
                    onChange={(e) => handleServiceChange(index, "name", e)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>service folder</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="/path/to/your/ms/folder"
                    onChange={(e) => handleServiceChange(index, "folder", e)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>service type</Form.Label>
                  <Form.Control
                    as="select"
                    name="msType"
                    onChange={(e) => handleServiceChange(index, "type", e)}
                  >
                    <option value="">type</option>
                    <option value="NodeJs">NodeJs</option>
                    <option value="springBoot">springBoot</option>
                    <option value="React">React</option>
                    <option value="Angular">Angular</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="ENV vars"
                    checked={svc.showEnvVars}
                    onChange={() => handleToggleEnvVars(index)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {svc.withEnvVars && (
              <div>
                <Table striped bordered hover>
                  <tbody>{renderVars(svc.envVars, index)}</tbody>
                </Table>
              </div>
            )}

            <Divider />
          </React.Fragment>
        ))}

        <br />
        <Button variant="primary" onClick={() => handleAddService()}>
          Add
        </Button>
      </>
    );
  };

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault(); // prevent the default form submit behavior
    setSubmited(true);
    console.log(formData);
    const formDataToSend = new FormData();

    formDataToSend.append("data", JSON.stringify(formData));
    formDataToSend.append("services", JSON.stringify(services));
    if (formData["infraType"] === "Existant K8S cluster") {
      formDataToSend.append("file", formData["infra"]["kubeConfigFile"]);
    }

    axios({
      method: "POST",
      url: "/api/deployMS",
      data: formDataToSend,
    })
      .then((res) => {
        console.log(res.data.status);
        if (res.data.status === "ok") {
          console.log("project added");
          const buildNumber = res.data.buildInfo.buildNumber;
          const projectName = res.data.buildInfo.projectName;
          navigate(`/deploymentMsView/${buildNumber}`, { state: { projectName } });
        }
        if (res.data.status === "bad") {
          setIsError(true);
          setSubmited(false);
          setError(res.data.error);
          console.log(res.data.error);
        }
        // handle successful response from server
      })
      .catch((error) => {});
    if (IsError) {
      setFormData({});
      var form = document.getElementById("deploy");
      form.reset();
    }
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/*  Site header */}

        {/*  Page content */}
        <main className="grow">
          <div
            className="relative max-w-6xl mx-auto h-0 pointer-events-none"
            aria-hidden="true"
          ></div>

          <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                {/* Page header */}

                {/* Form */}

                <>
                  <div className="card-container">
                    <div className="max-w-sm  mx-auto">
                      <Card border="secondary" style={{ width: "750px" }}>
                        <Card.Header>
                          <center>
                            <Card.Title>Deploy a microservice project</Card.Title>
                          </center>
                        </Card.Header>
                        <Card.Body>
                          <h6 style={{ color: "red" }}>{error}</h6>
                          <Form style={{ width: "700px" }} onSubmit={handleSubmit} id="deploy">
                            <Form.Group>
                              <Form.Label>Project Name</Form.Label>

                              <Form.Control
                                type="text"
                                placeholder="your project name"
                                name="projectName"
                                onChange={handleFormOnChange}
                              />
                            </Form.Group>

                            <Divider />
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Git Repo</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Git Url"
                                    name="gitUrl"
                                    onChange={(e) => handleFieldOnChange("gitRepo", e)}
                                    onPaste={(e) => handleFieldOnChange("gitRepo", e)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Git Branch</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Git branch "
                                    name="gitBranch"
                                    onChange={(e) => handleFieldOnChange("gitRepo", e)}
                                    onPaste={(e) => handleFieldOnChange("gitRepo", e)}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Divider />
                            {renderService(services)}
                            <Divider />
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Database type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="dbType"
                                    onChange={handleFormOnChange}
                                  >
                                    <option value="">DB type</option>
                                    <option value="MySql">MySql</option>
                                    <option value="Mongo">Mongo</option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Divider />
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Infra type</Form.Label>
                                  <Form.Control as="select" onChange={handleInfraTypeChange}>
                                    <option value="">Infra type</option>
                                    <option value="AZURE AKS">AZURE K8S Cluster (AKS)</option>
                                    <option value="AWS EKS">AWS EKS </option>
                                    <option value="Existant K8S cluster">
                                      Existant K8S Cluster
                                    </option>
                                    <option value="Existant VM">Existant Server</option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col>{renderFormFields()}</Col>
                            </Row>

                            <Divider />

                            {!submited && (
                              <Card.Footer>
                                <Button type="submit" style={{ background: "blue", opacity: "1" }}>
                                  Submit <Icon>send</Icon>
                                </Button>{" "}
                                <Button
                                  variant="secondary"
                                  style={{ background: "gray", opacity: "1" }}
                                >
                                  back <Icon>arrow_back</Icon>
                                </Button>
                              </Card.Footer>
                            )}
                            {submited && (
                              <Card.Footer>
                                <center>
                                  <h4>processing</h4>{" "}
                                  <Spinner animation="border" variant="success" />
                                </center>
                              </Card.Footer>
                            )}
                          </Form>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </section>
        </main>
      </div>
    </DashboardLayout>
  );
}

export default MsDeploy;
