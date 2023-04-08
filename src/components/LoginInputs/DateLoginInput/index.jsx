import PropTypes from 'prop-types';
import '../styles.css';

export const DateLoginInput = ({ onChange, placeholder }) => {
	return (
		<input type="date" className="loginInput form-control mt-3 mb-2" placeholder={placeholder} onChange={onChange} />
	);
};

DateLoginInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
