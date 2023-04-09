import PropTypes from 'prop-types';
import '../styles.css';

export const PasswordLoginInput = ({ onChange, placeholder, value }) => {
	return (
		<input
			type="password"
			className="loginInput form-control mt-3 mb-2"
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	);
};

PasswordLoginInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
