import { Link } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = (props) => {
  let content;
  if (props.auth.currentUser && !props.auth.currentUser.isAnonymous) {
    content = (
      <Link to="/Login" onClick={() => props.onLogout(props.auth)}>
        Logout
      </Link>
    );
  } else {
    content = <Link to="/Login">Login</Link>;
  }

  return (
    <div className="header">
      <div className="left">
        <Link to="/">Weather</Link>
      </div>
      <div className="right">
        {(!props.auth.currentUser || props.auth.currentUser.isAnonymous) && (
          <Link to="/register">Register</Link>
        )}
      </div>
      <div className="right">{content}</div>
    </div>
  );
};

export default NavigationBar;
