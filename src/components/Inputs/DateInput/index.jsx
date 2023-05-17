import PropTypes from 'prop-types';
import '../styles.css';

export const DateInput = ({ label, value, onChange, placeholder }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<input
				type="date"
				className="inputCustom form-control mt-2 mb-2"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

DateInput.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
