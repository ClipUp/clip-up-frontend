import "./TextInput.scss";
import propTypes from 'prop-types';

TextInput.propTypes = {
	value: propTypes.string,
	placeholder: propTypes.string,
	onChange: propTypes.func
  };
function TextInput({value, placeholder, onChange}) {
  return (
	<>
	  <input type="text"
	  value={value}
	  placeholder={placeholder}
	  onChange={onChange}/>
	</>
  )
}

export default TextInput