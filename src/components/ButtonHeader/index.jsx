import PropTypes from 'prop-types';
import './styles.css';

export const ButtonHeader = ({ text, disabled = false, target }) => {
	return (
		<button className="buttonHeader my-2" data-bs-toggle="modal" data-bs-target={target} disabled={disabled}>
			{text}
		</button>
	);
};

ButtonHeader.propTypes = {
	text: PropTypes.string.isRequired,
	target: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
};
