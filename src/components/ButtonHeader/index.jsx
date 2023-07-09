import PropTypes from 'prop-types';
import './styles.css';

export const ButtonHeader = ({ text, disabled = false, target, funcOnClick }) => {
	return (
		<button
			className="buttonHeader my-2"
			data-bs-toggle="modal"
			data-bs-target={target}
			disabled={disabled == null ? false : disabled}
			onClick={funcOnClick == null ? () => {} : funcOnClick}
		>
			{text}
		</button>
	);
};

ButtonHeader.propTypes = {
	text: PropTypes.string.isRequired,
	target: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	funcOnClick: PropTypes.func,
};
