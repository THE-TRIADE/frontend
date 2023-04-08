import PropTypes from 'prop-types';
import '../styles.css';

export const TextualInput = ({ label, onChange, placeholder }) => {
	return (
		<label className="customLabel">
			<div>{label}</div>
			<input type="text" className="inputText w-100" placeholder={placeholder} onChange={onChange} />
		</label>
	);
};

TextualInput.propTypes = {
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
