import { useToastStore } from '../../../store/modalStore';
import "./modal.scss"

const Toast = () => {
  const { toastMessages } = useToastStore();

  return (
    <div className="toast-card">
      {toastMessages.map((message, index) => (
        <div className="toast-message" key={index}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default Toast;