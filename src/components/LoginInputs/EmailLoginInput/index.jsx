import PropTypes from 'prop-types';
import '../styles.css';

export const EmailLoginInput = ({ onChange, placeholder }) => {
	return (
		<input type="email" className="loginInput form-control mt-3 mb-2" placeholder={placeholder} onChange={onChange} />
	);
};

EmailLoginInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
