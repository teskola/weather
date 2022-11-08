import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { auth, logInWithEmailAndPassword} from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (loading) {
      // jotain
      return;
    }
    if (user) history.push("/");
  }, [user, loading, history]);

  return (
    <div>
      <h2>Login</h2>
      <div>
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
        onClick={() => logInWithEmailAndPassword(email, password)}
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
