import "./Button.scss";
import propTypes from 'prop-types';

Button.propTypes = {
	children: propTypes.element,
	variant: propTypes.string,
	onClick: propTypes.func,
	disabled: propTypes.bool
  };
function Button({children, variant, onClick, disabled}) {
  return (
	<>
	  <button type="button"
	  
	  onClick={onClick}
	  disabled={disabled}
	  className={`default-button
		${variant === 'primary' ? 'primary' : ''}
		${variant === 'important' ? 'important' : ''}`
	  }>{children}</button>
	</>
  )
}

export default Button