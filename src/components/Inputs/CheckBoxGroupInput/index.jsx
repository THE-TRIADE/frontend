import PropTypes from 'prop-types';
import '../styles.css';

export const CheckBoxGroupInput = ({ label, options, onChange }) => {
	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<div className="btn-group row my-3 text-center" role="group">
				{options.map((option) => (
					<div className="col-6 col-sm-3 mt-2" key={`ckbox-${option.value}`}>
						<input
							name="inputCustom"
							type="checkbox"
							className="btn-check"
							id={`ckbox-${option.value}`}
							onChange={(e) => onChange(e, option.value)}
							key={`ckbox-${option.value}`}
						/>
						<label className="btn btn-outline-info w-100" htmlFor={`ckbox-${option.value}`}>
							{option.name}
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

CheckBoxGroupInput.propTypes = {
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		}),
	),
	onChange: PropTypes.func.isRequired,
};
