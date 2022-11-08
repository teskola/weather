const Modal = (props) => {
  return (
    <div className="modal">
      <p>{props.message}</p>
      <button className="btn" onClick={props.onConfirm}>
        OK
      </button>
    </div>
  );
};

export default Modal;
