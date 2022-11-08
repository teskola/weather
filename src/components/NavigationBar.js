import { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../firebase";
import Backdrop from "./Backdrop";
import Modal from "./Modal";
import "./NavigationBar.css";

const NavigationBar = (props) => {
  const [showModal, setShowModal] = useState(false);
  const logOutHandler = () => {
    logout();
    setShowModal(true);
  };
  let content;
  if (props.userLoggedIn) {
    content = (
      <Link to="/Login" onClick={logOutHandler}>
        Logout
      </Link>
    );
  } else {
    content = <Link to="/Login">Login</Link>;
  }

  return (
    <div className="header">
      {showModal && (
        <div>
          <Modal
            message={"Logged out succesfully."}
            onConfirm={() => setShowModal(false)}
          />
          <Backdrop onClick={() => setShowModal(false)}></Backdrop>
        </div>
      )}

      <nav>
        <ul>
          <li>
            <Link to="/">Weather</Link>
          </li>
          <li>
            <Link to="/AddLocationPage">Add location</Link>
          </li>
          <li>{content}</li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
