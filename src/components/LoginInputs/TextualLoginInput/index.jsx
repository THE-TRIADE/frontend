import PropTypes from 'prop-types';
import '../styles.css';

export const TextualLoginInput = ({ onChange, placeholder, size = 'medium' }) => {
	return <input type="text" className={'loginInput ' + size} placeholder={placeholder} onChange={onChange} />;
};

TextualLoginInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
	size: PropTypes.oneOf('small', 'medium', 'large'),
};
