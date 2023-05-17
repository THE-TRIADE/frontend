import PropTypes from 'prop-types';
import '../styles.css';

export const SelectInput = ({ options, onChange, value, label }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<select className="selectCustom form-select mt-2 mb-2" value={value} onChange={onChange}>
				{options.map((o) => (
					<option value={o} key={o}>
						{o}
					</option>
				))}
			</select>
		</div>
	);
};

SelectInput.propTypes = {
	label: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
