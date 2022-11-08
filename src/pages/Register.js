import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (user) history.push("/");
  }, [user, loading, history]);

  return (
    <div>
      <h2>Register</h2>
      <div>
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
      <button
        className="btn"
        onClick={() => props.onRegister(auth, email, password)}
      >
        OK
      </button>
      {/*  <button onClick={signInWithGoogle}>Register with Google</button> */}
    </div>
  );
};

export default Register;
