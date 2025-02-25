import "./Button.scss";
import propTypes from 'prop-types';

IconButton.propTypes = {
	children: propTypes.element,
	title: propTypes.string,
	onClick: propTypes.func,
	disabled: propTypes.bool
};
function IconButton({children, title, onClick, disabled}) {
	return (
	<>
		<button
	  type="button"
		title={title}
	  onClick={onClick}
	  disabled={disabled}
	  className="icon-button"
		>
			{children}
		</button>
	</>
	)
}

export default IconButton;