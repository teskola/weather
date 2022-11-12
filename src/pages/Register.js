import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Register = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [user] = useAuthState(auth);
  const [isRegistering, setIsRegistering] = useState(false);
  const history = useHistory();

  const register = async () => {
    setIsRegistering(true);
    if (!user) {
      await props.onRegister(emailRef.current.value, passwordRef.current.value);
    }
    setIsRegistering(false);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      register();
    }
  };

  useEffect(() => {
    if (user && !isRegistering && !user.isAnonymous) history.push("/");
  }, [user, history, isRegistering]);

  return (
    <div>
      <h2>Register</h2>
      <div onKeyDown={handleKeyPress}>
        <input type="text" ref={emailRef} placeholder="Email" />
        <input type="password" ref={passwordRef} placeholder="Password" />
      </div>
      <br></br>
      {isRegistering && <p>Please wait</p>}
      <button className="btn" onClick={register} onKeyDown={handleKeyPress}>
        OK
      </button>
      {/*  <button onClick={signInWithGoogle}>Register with Google</button> */}
    </div>
  );
};

export default Register;
