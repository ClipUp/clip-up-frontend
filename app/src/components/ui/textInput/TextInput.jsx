import "./TextInput.scss";
import propTypes from 'prop-types';

TextInput.propTypes = {
	className: propTypes.string,
	type: propTypes.string,
	value: propTypes.string,
	placeholder: propTypes.string,
	error: propTypes.string,
	onChange: propTypes.func,
	onKeyDown: propTypes.func,
	disabled: propTypes.bool
};
function TextInput({name, value, placeholder, type, error, onChange, onKeyDown, disabled = false}) {
  return (
	<div className="default-input">
	  <input
			type={type}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			onKeyDown={onKeyDown}
			className={ `${name} ${error ? "error" : ""}`}
			name={name}
			disabled={disabled}
		/>
		<p className="confirm-text">{error}</p>
	</div>
  )
}

export default TextInput