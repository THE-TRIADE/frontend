import PropTypes from 'prop-types';
import '../styles.css';

export const TextualLoginInput = ({ onChange, placeholder }) => {
	return (
		<input type="text" className="loginInput form-control mt-3 mb-2" placeholder={placeholder} onChange={onChange} />
	);
};

TextualLoginInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
