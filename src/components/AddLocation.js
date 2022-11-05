import { useRef } from "react";

const AddLocation = (props) => {
  const latRef = useRef("");
  const lonRef = useRef("");

  const submitHandler = (event) => {
    event.preventDefault();

    const location = {
      lat: latRef.current.value,
      lon: lonRef.current.value,
    };

    props.onAddLocation(location);
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="text">lat</label>
        <textarea rows="1" id="lat" ref={latRef} />
      </div>
      <div>
        <label htmlFor="text">lon</label>
        <textarea rows="1" id="lon" ref={lonRef} />
      </div>
      <button>Add Location</button>
    </form>
  );
};

export default AddLocation;
