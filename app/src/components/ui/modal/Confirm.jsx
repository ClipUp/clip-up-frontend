import { useConfirmStore } from "../../../store/modalStore";

const Confirm = () => {
  const { isOpen, title, children, confirmText, cancelText, closeDialog, variant } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay
			${variant === 'primary' ? 'primary' : ''}
			${variant === 'important' ? 'important' : ''}`
		}>
      <div className=".modal">
				<div className="modal-title">{title}</div>
        <div className="modal-content">{children}</div>
        <div className="modal-buttons">
          { confirmText && <button onClick={() => closeDialog(true)}>{confirmText}</button> }
          { cancelText && <button onClick={() => closeDialog(false)}>{cancelText}</button> }
        </div>
      </div>
    </div>
  );
};

export default Confirm;
