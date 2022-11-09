import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const AddLocation = (props) => {
  const history = useHistory();
  const latRef = useRef("");
  const lonRef = useRef("");
  const [isAdding, setIsAdding] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    setIsAdding(true);
    const location = {
      lat: latRef.current.value,
      lon: lonRef.current.value,
    };
    props.onAddLocation(location);
    history.push("/");
  };

  let content;
  if (isAdding) {
    content = <p>Please wait</p>;
  } else if (props.userLoggedIn) {
    content = (
      <form onSubmit={submitHandler}>
        <label className="monospace" htmlFor="lat">
          lat{" "}
        </label>
        <input type="text" size={5} ref={latRef} />
        <br></br>
        <label className="monospace" htmlFor="lon">
          lon{" "}
        </label>
        <input type="text" size={5} ref={lonRef} />

        <p>
          <button>Add Location</button>
        </p>
      </form>
    );
  } else {
    content = <p>Login to add location.</p>;
  }

  return (
    <div>
      {content}
      <br></br>
    </div>
  );
};

export default AddLocation;
