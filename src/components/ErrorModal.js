const ErrorModal = (props) => {
  return (
    <div className="modal">
      <p>{props.error}</p>
      <button className="btn" onClick={props.onConfirm}>
        OK
      </button>
    </div>
  );
};

export default ErrorModal;
