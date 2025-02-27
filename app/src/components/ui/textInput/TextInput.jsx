import "./TextInput.scss";
import propTypes from 'prop-types';

TextInput.propTypes = {
	type: propTypes.string,
	value: propTypes.string,
	placeholder: propTypes.string,
	error: propTypes.string,
	onChange: propTypes.func
};
function TextInput({value, placeholder, type, error, onChange}) {
  return (
	<div className="default-input">
	  <input type={type}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			className={ error ? "error" : "" }
		/>
		<p className="confirm-text">{error}</p>
	</div>
  )
}

export default TextInput