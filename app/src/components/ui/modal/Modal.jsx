import { useModalStore } from '../../../store/ModalStore';
import './Modal.scss';
import propTypes from 'prop-types';

Modal.propTypes = {
	children: propTypes.element,
	title: propTypes.string,
	variant: propTypes.string,
	isOpen: propTypes.bool
};
function Modal({title, variant}) {
	const { isOpen, children, closeModal } = useModalStore();
	if (!isOpen) return null;
	return (
		<div className="modal-overlay">
      <div className={`modal
				${variant === 'primary' ? 'primary' : ''}
				${variant === 'important' ? 'important' : ''}`}
				onClick={(e) => {e.stopPropagation()}}
			>
				<h3>{title}</h3>
        <button
					type="button"
					title="닫기"
					onClick={closeModal}
					className="modal-close">
          닫기
        </button>
        {children}
      </div>
    </div>
	)
}

export default Modal;