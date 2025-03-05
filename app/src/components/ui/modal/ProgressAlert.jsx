import { useProgressAlertStore, useSpinnerAlertStore } from "../../../store/modalStore";
import ProgressBar from "../../features/audio/ProgressBar";
import Lottie from "lottie-react";
import Spin from "../../../assets/lottie/loading_animation.json";
import "./modal.scss";

const SpinnerAlert = () => {
  const { isOpen, title, confirmText, cancelText, closeSpinner, variant } = useSpinnerAlertStore();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm spinner">
        <Lottie className="spin-lottie" animationData={Spin} loop={true} autoplay />
        <h4 className="confirm-title">{title}</h4>
        <div className={`confirm-button-group
				${variant === 'primary' ? 'primary' : ''}
				${variant === 'important' ? 'important' : ''}`
				}>
          { confirmText && <button className="confirm-button" onClick={() => closeSpinner(true)}>{confirmText}</button> }
          { cancelText && <button className="cancle-button" onClick={() => closeSpinner(false)}>{cancelText}</button> }
        </div>
      </div>
    </div>
  );
};

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

export {ProgressAlert, SpinnerAlert};
