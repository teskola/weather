import "./Login.css";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Message from "../components/Message";

const Login = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [message, setMessage] = useState(null);
  const [user] = useAuthState(auth);
  const history = useHistory();

  const resetPassword = async () => {
    if (emailRef.current.value === "") {
      document.getElementById("email").focus();
    } else {
      try {
        await sendPasswordResetEmail(emailRef.current.value);
        setMessage(`Password reset email sent to: ${emailRef.current.value}`);
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  useEffect(() => {
    if (user) history.push("/");
  }, [user, history]);

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      props.onEmailLogin(emailRef.current.value, passwordRef.current.value);
    }
  };

  return (
    <div>
      {message && (
        <Message message={message} onConfirm={() => setMessage(null)} />
      )}
      <h2>Login</h2>
      <form onKeyDown={handleKeyPress}>
        <input
          id="email"
          type="text"
          ref={emailRef}
          placeholder="E-mail address"
        />
        <input type="password" ref={passwordRef} placeholder="Password" />
      </form>
      <br></br>
      <button
        className="btn"
        onClick={() =>
          props.onEmailLogin(emailRef.current.value, passwordRef.current.value)
        }
        onKeyDown={handleKeyPress}
      >
        OK
      </button>
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
