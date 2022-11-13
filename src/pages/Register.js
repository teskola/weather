import { useRef, useState } from "react";

const Register = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isRegistering, setIsRegistering] = useState(false);

  const register = async () => {
    setIsRegistering(true);
    if (emailRef.current.value && (!props.user || props.user.isAnonymous)) {
      await props.onRegister(emailRef.current.value, passwordRef.current.value);
    }
    setIsRegistering(false);
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
