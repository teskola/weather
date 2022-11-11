const Modal = (props) => {
  return (
    <div className="modal">
      <p>{props.message}</p>
      <button className="btn" autoFocus={true} onClick={props.onConfirm}>
        OK
      </button>
    </div>
  );
};

export default Modal;
