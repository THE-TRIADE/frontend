import PropTypes from 'prop-types';
import './styles.css';

export const ButtonOutlineSecondary = ({ text, link }) => {
	return (
		<a href={link} className="buttonOutlineSecondary pt-3 text-center">
			{text}
		</a>
	);
};

ButtonOutlineSecondary.propTypes = {
	text: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};
