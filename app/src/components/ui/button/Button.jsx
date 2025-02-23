import "./Button.scss";
import propTypes from 'prop-types';

Button.propTypes = {
	children: propTypes.element,
	title: propTypes.string,
	variant: propTypes.string,
	onClick: propTypes.func,
	disabled: propTypes.bool
};
function Button({children, title, variant, onClick, disabled}) {
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
      }>{children}</button>
	</>
	)
}

export default Button;