import { useRef, useState } from "react";

const Register = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isRegistering, setRegisteringState] = useState(false);

  const register = async () => {
    if (!emailRef.current.value) {
      emailRef.current.focus();
    } else if (!props.auth.currentUser || props.auth.currentUser.isAnonymous) {
      setRegisteringState(true);
      await props.onRegister(
        emailRef.current.value,
        passwordRef.current.value,
        props.auth
      );
      setRegisteringState(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      register();
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <div onKeyDown={handleKeyPress}>
        <input type="email" ref={emailRef} placeholder="Email" />
        <input type="password" ref={passwordRef} placeholder="Password" />
      </div>
      <br></br>
      {isRegistering && <p>Please wait</p>}
      <button className="btn" onClick={register} onKeyDown={handleKeyPress}>
        OK
      </button>
    </div>
  );
};

export default Register;
