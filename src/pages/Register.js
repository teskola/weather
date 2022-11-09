import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);
  const [isRegistering, setIsRegistering] = useState(false);
  const history = useHistory();

  const register = () => {
    setIsRegistering(true);
    props.onRegister(auth, email, password);
    setIsRegistering(false);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      register();
    }
  };

  useEffect(() => {
    if (user && !isRegistering) history.push("/");
  }, [user, history, isRegistering]);

  return (
    <div>
      <h2>Register</h2>
      <div onKeyDown={handleKeyPress}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
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
