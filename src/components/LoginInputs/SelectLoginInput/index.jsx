import PropTypes from 'prop-types';
import '../styles.css';

export const SelectLoginInput = ({ options, onChange, size = 'medium', value }) => {
	return (
		<select className={'loginSelect ' + size} value={value} onChange={onChange}>
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
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};
