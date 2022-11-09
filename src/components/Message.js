import Backdrop from "./Backdrop";
import Modal from "./Modal";

const Message = (props) => {
  return (
    <>
      <Modal message={props.message} onConfirm={props.onConfirm} />
      <Backdrop onClick={props.onConfirm} />
    </>
  );
};
export default Message;
