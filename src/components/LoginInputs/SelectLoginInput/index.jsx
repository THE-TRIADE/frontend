import PropTypes from 'prop-types';
import '../styles.css';

export const SelectLoginInput = ({ options, onChange, value }) => {
	return (
		<select className="loginSelect form-select mt-3 mb-2" value={value} onChange={onChange}>
			{options.map((o) => (
				<option value={o} key={o}>
					{o}
				</option>
			))}
		</select>
	);
};

SelectLoginInput.propTypes = {
	options: PropTypes.array.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
