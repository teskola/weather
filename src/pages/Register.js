import { useRef, useState } from "react";

const Register = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const register = async () => {
    props.setRegisteringState(true);
    if (emailRef.current.value && (!props.user || props.user.isAnonymous)) {
      await props.onRegister(emailRef.current.value, passwordRef.current.value);
    }
    props.setRegisteringState(false);
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
      {props.isRegistering && <p>Please wait</p>}
      <button className="btn" onClick={register} onKeyDown={handleKeyPress}>
        OK
      </button>
    </div>
  );
};

export default Register;
