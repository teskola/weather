import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (user) history.push("/");
  }, [user, history]);

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      props.onEmailLogin(email, password);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div onKeyDown={handleKeyPress}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail address"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <br></br>
      <button
        className="btn"
        onClick={() => props.onEmailLogin(email, password)}
        onKeyDown={handleKeyPress}
      >
        OK
      </button>
      {/* <button onClick={signInWithGoogle}>Login with Google</button> */}
      <p>Reset password</p>
      <p>
        <Link to="/Register">Don't have an account yet? Register.</Link>
      </p>
    </div>
  );
};
export default Login;
