import PropTypes from 'prop-types';
import '../styles.css';

export const PasswordLoginInput = ({ onChange, placeholder }) => {
	return (
		<input
			type="password"
			className="loginInput form-control mt-3 mb-2"
			placeholder={placeholder}
			onChange={onChange}
		/>
	);
};

PasswordLoginInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
