import PropTypes from 'prop-types';
import '../styles.css';
import ReactInputMask from 'react-input-mask';

export const CpfInput = ({ label, value, onChange, placeholder, required = false }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">
				{required ? (
					<>
						{label}
						<b>*</b>
					</>
				) : (
					label
				)}
			</label>
			<ReactInputMask mask="999.999.999-99" value={value} onChange={(e) => onChange(e)}>
				{() => <input type="text" className="inputCustom form-control mt-2 mb-2" placeholder={placeholder} />}
			</ReactInputMask>
		</div>
	);
};

CpfInput.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
	required: PropTypes.bool,
};
