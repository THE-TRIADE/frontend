import PropTypes from 'prop-types';

export const CheckBoxInput = ({ label, value, onChange }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<div className="form-check my-3">
				<input
					name="inputCustom"
					type="checkbox"
					className="form-check-input"
					id={`ckbox-${value}`}
					onChange={(e) => onChange(e, value)}
					key={`ckbox-${value}`}
				/>
				<label className="form-check-label w-100" htmlFor={`ckbox-${value}`}>
					{value}
				</label>
			</div>
		</div>
	);
};

CheckBoxInput.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
