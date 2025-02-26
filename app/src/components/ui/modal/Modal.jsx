import { useModalStore } from '../../../store/modalStore';
import IconButton from '../button/IconButton';
import './Modal.scss';
import propTypes from 'prop-types';
import Close from '../../../assets/icon/close.svg'

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
        <IconButton
					title="닫기"
					onClick={closeModal}
				>
					<img src={Close} />
				</IconButton>
        {children}
      </div>
    </div>
	)
}

export default Modal;