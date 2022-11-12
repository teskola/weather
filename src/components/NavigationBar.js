import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import Message from "./Message";

import "./NavigationBar.css";

const NavigationBar = (props) => {
  const [showMessage, setShowMessage] = useState(false);
  const logOutHandler = () => {
    signOut(auth);
    setShowMessage(true);
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
      {showMessage && (
        <Message
          message={"Logged out succesfully."}
          onConfirm={() => setShowMessage(false)}
        />
      )}

      <nav>
        <ul>
          <li>{content}</li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
