import AddLocation from "../components/AddLocation";

const AddLocationPage = (props) => {
  return (
    <>
      <AddLocation
        onAddLocation={props.onAddLocation}
        userLoggedIn={props.userLoggedIn}
      />
    </>
  );
};
export default AddLocationPage;
