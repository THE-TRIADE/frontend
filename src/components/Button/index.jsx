import PropTypes from 'prop-types';
import './styles.css';

export const Button = ({ text, onClick, disabled = false }) => {
	return (
		<button onClick={onClick} disabled={disabled}>
			{text}
		</button>
	);
};

Button.defaultProps = {
	disabled: false,
};

Button.propTypes = {
	text: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};
