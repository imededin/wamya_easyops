import React, { useState } from "react";
import Button from "react-bootstrap/Button";
//import Form from "react-bootstrap/Form";
import SignIn from "./SignIn";
import Modal from "react-bootstrap/Modal";
import { Routes, Route, useNavigate } from "react-router-dom";

function Example() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    navigate("/");
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignIn />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Example;
//render(<Example />);
