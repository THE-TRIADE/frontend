import PropTypes from 'prop-types';
import '../styles.css';

export const SelectInput = ({ options, onChange, value, label }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<select className="selectCustom form-select mt-2 mb-2" value={value} onChange={onChange}>
				{options.map((o) => (
					<option value={o.optValue} key={o.optName} disabled={o.disabled === null ? false : o.disabled}>
						{o.optName}
					</option>
				))}
			</select>
		</div>
	);
};

SelectInput.propTypes = {
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			optName: PropTypes.string.isRequired,
			optValue: PropTypes.string.isRequired,
			disabled: PropTypes.bool,
		}),
	).isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
