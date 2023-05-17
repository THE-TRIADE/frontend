import PropTypes from 'prop-types';
import '../styles.css';

export const TextualLoginInput = ({ value, onChange, placeholder }) => {
	return (
		<input
			type="text"
			className="loginInput form-control mt-3 mb-2"
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	);
};

TextualLoginInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
