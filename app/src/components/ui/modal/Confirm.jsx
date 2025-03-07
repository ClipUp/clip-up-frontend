import { useConfirmStore } from "../../../store/modalStore";
import "./modal.scss";

const Confirm = () => {
  const { isOpen, title, children, confirmText, cancelText, closeConfirm, variant } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm">
				<h4 className="confirm-title">{title}</h4>
				{(children !== null && children !== undefined) && (
					<div className="confirm-content">{children}</div>
				)}
        <div className={`confirm-button-group
				${variant === 'primary' ? 'primary' : ''}
				${variant === 'important' ? 'important' : ''}`
				}>
          { cancelText && <button className="cancle-button" onClick={() => closeConfirm(false)}>{cancelText}</button> }
          { confirmText && <button className="confirm-button" onClick={() => closeConfirm(true)}>{confirmText}</button> }
        </div>
      </div>
    </div>
  );
};

export default Confirm;
