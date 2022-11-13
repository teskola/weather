import { Link } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = (props) => {
  let content;
  if (props.userLoggedIn) {
    content = (
      <Link to="/Login" onClick={props.onLogout}>
        Logout
      </Link>
    );
  } else {
    content = <Link to="/Login">Login</Link>;
  }

  return (
    <div className="header">
      <nav>
        <ul>
          {(props.anonymousLogin || !props.userLoggedIn) && (
            <li>
              <Link to="/register">Register</Link>
            </li>
          )}
          <li>{content}</li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
