import PropTypes from 'prop-types';
import './styles.css';

export const ButtonAction = ({ text, onClick, bgColor }) => {
	return (
		<button className={'buttonAction my-2 mx-1 ' + bgColor} onClick={onClick}>
			{text}
		</button>
	);
};

ButtonAction.propTypes = {
	text: PropTypes.string.isRequired,
	bgColor: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
