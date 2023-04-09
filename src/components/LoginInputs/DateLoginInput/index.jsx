import PropTypes from 'prop-types';
import '../styles.css';

export const DateLoginInput = ({ value, onChange, placeholder }) => {
	return (
		<input
			type="date"
			className="loginInput form-control mt-3 mb-2"
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	);
};

DateLoginInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
