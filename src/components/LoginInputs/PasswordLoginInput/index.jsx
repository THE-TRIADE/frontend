import PropTypes from 'prop-types';
import '../styles.css';

export const PasswordLoginInput = ({ onChange, placeholder, size = 'medium' }) => {
	return <input type="password" className={'loginInput ' + size} placeholder={placeholder} onChange={onChange} />;
};

PasswordLoginInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
	size: PropTypes.oneOf('small', 'medium', 'large'),
};
