import PropTypes from 'prop-types';
import './styles.css';

export const ButtonOutline = ({ text, onClick, disabled = false }) => {
	return (
		<button className="buttonOutline my-2" onClick={onClick} disabled={disabled}>
			{text}
		</button>
	);
};

ButtonOutline.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};
