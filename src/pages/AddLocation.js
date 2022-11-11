import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Search from "../components/Search";

const AddLocation = (props) => {
  const history = useHistory();
  const latRef = useRef("");
  const lonRef = useRef("");
  const [isAdding, setIsAdding] = useState(false);

  const setLatLon = (lat, lon) => {
    latRef.current.value = lat;
    lonRef.current.value = lon;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsAdding(true);
    const location = {
      lat: latRef.current.value,
      lon: lonRef.current.value,
    };
    if ((await props.onAddLocation(location)) === 1) {
      await props.resetToken();
      await props.onAddLocation(location);
    }
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
      <h2>Add Location</h2>
      <Search setLatLon={setLatLon}></Search>
      {content}
    </div>
  );
};

export default AddLocation;
