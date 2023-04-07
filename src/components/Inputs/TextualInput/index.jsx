import PropTypes from 'prop-types';
import '../styles.css';

export const TextualInput = ({ label, onChange, placeholder, size = 'medium' }) => {
	return (
		<label className="customLabel">
			<div>{label}</div>
			<input type="text" className={'inputText ' + size} placeholder={placeholder} onChange={onChange} />
		</label>
	);
};

TextualInput.propTypes = {
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};
