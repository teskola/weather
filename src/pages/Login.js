import "./Login.css";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Login = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [waiting, setWaiting] = useState(false);
  const [user] = useAuthState(auth);
  const history = useHistory();

  const login = async () => {
    setWaiting(true);
    await props.onEmailLogin(emailRef.current.value, passwordRef.current.value);
    setWaiting(false);
  };

  const resetPassword = async () => {
    if (emailRef.current.value === "") {
      emailRef.current.focus();
    } else {
      setWaiting(true);
      await props.onPasswordReset(emailRef.current.value);
      setWaiting(false);
    }
  };

  useEffect(() => {
    if (user) history.push("/");
  }, [user, history]);

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      login();
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onKeyDown={handleKeyPress}>
        <input type="text" ref={emailRef} placeholder="E-mail address" />
        <input type="password" ref={passwordRef} placeholder="Password" />
      </form>
      <br></br>
      <button className="btn" onClick={login} onKeyDown={handleKeyPress}>
        OK
      </button>

      {waiting && <p>Please wait.</p>}

      {/* <button onClick={signInWithGoogle}>Login with Google</button> */}
      <p className="reset" onClick={resetPassword}>
        Reset password
      </p>
      <p>
        <Link to="/Register">Don't have an account yet? Register.</Link>
      </p>
    </div>
  );
};
export default Login;
