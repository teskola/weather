import "./Login.css";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Login = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [waiting, setWaiting] = useState(false);

  const anonymousLogin = async () => {
    setWaiting(true);
    props.setRegisteringState(true);
    await props.onRegister();
    setWaiting(false);
    props.setRegisteringState(false);
  };

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
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      login();
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onKeyDown={handleKeyPress}>
        <input type="email" ref={emailRef} placeholder="E-mail address" />
        <input type="password" ref={passwordRef} placeholder="Password" />
      </form>
      <br></br>
      <button className="btn" onClick={login} onKeyDown={handleKeyPress}>
        OK
      </button>

      {waiting && <p>Please wait.</p>}

      <p className="reset" onClick={resetPassword}>
        Reset password
      </p>
      <p>
        <Link to="/Register">Don't have an account yet? Register.</Link>
      </p>
      <p className="anonymous" onClick={anonymousLogin}>
        Continue anonymously.
      </p>
    </div>
  );
};
export default Login;
