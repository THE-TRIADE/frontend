import PropTypes from 'prop-types';
import '../styles.css';

export const TextualInput = ({ label, value, onChange, placeholder }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<input
				name="inputCustom"
				type="text"
				className="inputCustom form-control mt-2 mb-2"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

TextualInput.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
