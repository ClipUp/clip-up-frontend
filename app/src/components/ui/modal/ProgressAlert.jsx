import { useProgressAlertStore } from "../../../store/modalStore";
import ProgressBar from "../../features/audio/ProgressBar";
import "./modal.scss";

const ProgressAlert = () => {
  const { isOpen, title, confirmText, cancelText, closeProgress, variant } = useProgressAlertStore();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm">
				<h4 className="confirm-title">{title}</h4>
				<ProgressBar />
        <div className={`confirm-button-group
				${variant === 'primary' ? 'primary' : ''}
				${variant === 'important' ? 'important' : ''}`
				}>
          { confirmText && <button className="confirm-button" onClick={() => closeProgress(true)}>{confirmText}</button> }
          { cancelText && <button className="cancle-button" onClick={() => closeProgress(false)}>{cancelText}</button> }
        </div>
      </div>
    </div>
  );
};

export default ProgressAlert;
