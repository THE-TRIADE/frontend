import PropTypes from 'prop-types';
import './styles.css';

export const ButtonFinishActivity = ({ text, onClick, disabled = false }) => {
	return (
		<button className="button my-2" onClick={onClick} disabled={disabled}>
			{text}
		</button>
	);
};

ButtonFinishActivity.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};
