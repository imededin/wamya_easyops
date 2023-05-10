import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SignIn from "./SignIn";

function StaticExample() {
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog dialogClassName="modal-90w">
        {/* <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header> */}

        <Modal.Body>
          <SignIn />
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
}

export default StaticExample;
