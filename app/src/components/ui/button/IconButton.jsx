import "./Button.scss";
import propTypes from 'prop-types';

IconButton.propTypes = {
	title: propTypes.string,
	variant: propTypes.string,
	onClick: propTypes.func,
	disabled: propTypes.bool
};
function IconButton({title, variant, onClick, disabled}) {
	return (
	<>
		<button
	  type="button"
		title={title}
	  onClick={onClick}
	  disabled={disabled}
	  className={`default-button
	  ${variant === 'primary' ? 'primary' : ''}
	  ${variant === 'important' ? 'important' : ''}`
	  }></button>
	</>
	)
}

export default IconButton;