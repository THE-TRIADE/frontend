import PropTypes from 'prop-types';
import './styles.css';

export const Button = ({ text, onClick, size = 'medium', disabled = false }) => {
	return (
		<button className={'button ' + size} onClick={onClick} disabled={disabled}>
			{text}
		</button>
	);
};

Button.defaultProps = {
	disabled: false,
	size: 'medium',
};

Button.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	size: PropTypes.oneOf('small', 'medium', 'large'),
};
