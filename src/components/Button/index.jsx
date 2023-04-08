import PropTypes from 'prop-types';
import './styles.css';

export const Button = ({ text, onClick, disabled = false }) => {
	return (
		<button className="button my-2" onClick={onClick} disabled={disabled}>
			{text}
		</button>
	);
};

Button.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};
