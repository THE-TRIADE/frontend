import PropTypes from 'prop-types';
import '../styles.css';

export const EmailLoginInput = ({ value, onChange, placeholder }) => {
	return (
		<input
			type="email"
			className="loginInput form-control mt-3 mb-2"
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	);
};

EmailLoginInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
