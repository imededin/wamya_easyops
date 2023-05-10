import { Form, Row, Col, Card, Button } from "react-bootstrap";
import Header from "../partials/Header";
import PageIllustration from "../partials/PageIllustration";
import Banner from "../partials/Banner";
import "../main.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserHome({ userData }) {
  const email = userData.email;
  console.log(email);
  const [infraType, setInfraType] = useState("");
  const [formData, setFormData] = useState({});

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
      email: email,
    });
  };

  const handleFormOnChange = (e) => {
    if (e.type === "change") {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    } else if (e.type === "paste") {
      const clipboardData = e.clipboardData;
      const pastedText = clipboardData.getData("text");
      const name = e.target.name;
      setFormData({
        ...formData,
        [name]: pastedText,
      });
      console.log(pastedText);
    }
  };
  const handleFieldOnChange = (field, e) => {
    if (e.type === "change") {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [name]: value,
        },
      });
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

  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // prevent the default form submit behavior
    console.log(formData);

    fetch("http://127.0.0.1:8082/api/deploy", {
      // replace "/api/submit" with the actual endpoint on your backend server
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setError(data.error);
        // handle successful response from server
      })
      .catch((error) => {
        alert(error);
        // handle error response from server
      });
    setFormData({});
    var form = document.getElementById("deploy");
    form.reset();
  }
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="grow">
        <div
          className="relative max-w-6xl mx-auto h-0 pointer-events-none"
          aria-hidden="true"
        >
          <PageIllustration />
        </div>

        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}

              {/* Form */}

              <>
                <div className="card-container">
                  <div className="max-w-sm  mx-auto">
                    <Card border="secondary" style={{ width: "550px" }}>
                      <Card.Header>
                        <center>
                          <Card.Title>Deploy a 3-Tier project</Card.Title>
                        </center>
                      </Card.Header>
                      <Card.Body>
                        <Form
                          style={{ width: "500px" }}
                          onSubmit={handleSubmit}
                          id="deploy"
                        >
                          <Form.Group>
                            <Form.Label>Project Name</Form.Label>
                            <h3 style={{ color: "red" }}>{error}</h3>
                            <Form.Control
                              type="text"
                              placeholder="your project name"
                              name="projectName"
                              onChange={handleFormOnChange}
                            />
                          </Form.Group>
                          <span>
                            <div className="flex items-center my-6">
                              <div
                                className="border-t border-gray-700 border-dotted grow mr-3"
                                aria-hidden="true"
                              ></div>
                              <div className="text-gray-400">
                                Repository setup
                              </div>
                              <div
                                className="border-t border-gray-700 border-dotted grow ml-3"
                                aria-hidden="true"
                              ></div>
                            </div>

                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Git Repo</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Git Url"
                                    name="gitUrl"
                                    onChange={(e) =>
                                      handleFieldOnChange("gitRepo", e)
                                    }
                                    onPaste={(e) =>
                                      handleFieldOnChange("gitRepo", e)
                                    }
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
                                    onChange={(e) =>
                                      handleFieldOnChange("gitRepo", e)
                                    }
                                    onPaste={(e) =>
                                      handleFieldOnChange("gitRepo", e)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <div className="flex items-center my-6">
                              <div
                                className="border-t border-gray-700 border-dotted grow mr-3"
                                aria-hidden="true"
                              ></div>
                              <div className="text-gray-400">Backend Setup</div>
                              <div
                                className="border-t border-gray-700 border-dotted grow ml-3"
                                aria-hidden="true"
                              ></div>
                            </div>
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>backend folder</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="/path/to/your/backend/folder"
                                    name="backendFolder"
                                    onChange={(e) =>
                                      handleFieldOnChange("backend", e)
                                    }
                                    onPaste={(e) =>
                                      handleFieldOnChange("backend", e)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>backend type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="backendType"
                                    onChange={(e) =>
                                      handleFieldOnChange("backend", e)
                                    }
                                  >
                                    <option value="">Backend type</option>
                                    <option value="NodeJs">NodeJs</option>
                                    <option value="springBoot">
                                      springBoot
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>

                            <div className="flex items-center my-6">
                              <div
                                className="border-t border-gray-700 border-dotted grow mr-3"
                                aria-hidden="true"
                              ></div>
                              <div className="text-gray-400">
                                Frontend Setup
                              </div>
                              <div
                                className="border-t border-gray-700 border-dotted grow ml-3"
                                aria-hidden="true"
                              ></div>
                            </div>
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Frontend folder</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="/path/to/your/frontend/folder"
                                    name="frontendFolder"
                                    onChange={(e) =>
                                      handleFieldOnChange("frontend", e)
                                    }
                                    onPaste={(e) =>
                                      handleFieldOnChange("frontend", e)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>frontend type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="frontendType"
                                    onChange={(e) =>
                                      handleFieldOnChange("frontend", e)
                                    }
                                  >
                                    <option value="">Frontend type</option>
                                    <option value="React">React</option>
                                    <option value="Angular">Angular</option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                            </Row>

                            <div className="flex items-center my-6">
                              <div
                                className="border-t border-gray-700 border-dotted grow mr-3"
                                aria-hidden="true"
                              ></div>
                              <div className="text-gray-400">
                                Database Setup
                              </div>
                              <div
                                className="border-t border-gray-700 border-dotted grow ml-3"
                                aria-hidden="true"
                              ></div>
                            </div>
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

                            <div className="flex items-center my-6">
                              <div
                                className="border-t border-gray-700 border-dotted grow mr-3"
                                aria-hidden="true"
                              ></div>
                              <div className="text-gray-400">
                                InfraStructure Setup
                              </div>
                              <div
                                className="border-t border-gray-700 border-dotted grow ml-3"
                                aria-hidden="true"
                              ></div>
                            </div>
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Infra type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    onChange={handleInfraTypeChange}
                                  >
                                    <option value="">Infra type</option>
                                    <option value="AZURE AKS">
                                      AZURE K8S Cluster (AKS)
                                    </option>
                                    <option value="AWS EKS">AWS EKS </option>
                                    <option value="Existant K8S cluster">
                                      Existant K8S Cluster
                                    </option>
                                    <option value="Existant VM">
                                      Existant Server
                                    </option>
                                  </Form.Control>
                                </Form.Group>
                              </Col>
                              <Col>{renderFormFields()}</Col>
                            </Row>
                          </span>
                          <div className="flex items-center my-6">
                            <div
                              className="border-t border-gray-700 border-dotted grow mr-3"
                              aria-hidden="true"
                            ></div>
                            <div className="text-gray-400"></div>
                            <div
                              className="border-t border-gray-700 border-dotted grow ml-3"
                              aria-hidden="true"
                            ></div>
                          </div>

                          <Card.Footer>
                            <Button
                              type="submit"
                              style={{ background: "blue", opacity: "1" }}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary"
                              style={{ background: "gray", opacity: "1" }}
                            >
                              back
                            </Button>
                          </Card.Footer>
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

      <Banner />
    </div>
  );
}

export default UserHome;
