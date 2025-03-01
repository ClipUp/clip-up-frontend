import { useProgressAlertStore } from "../../../store/modalStore";
import "./progressBar.scss"

const ProgressBar = () => {
  const { progress } = useProgressAlertStore();

  return (
    <div className="progress-bar">
      <div
        className="progress-rate"
        style={{
          width: `${progress}%`,
          height: "100%",
          transition: "0.2s",
        }}
      />
    </div>
  );
}

export default ProgressBar;