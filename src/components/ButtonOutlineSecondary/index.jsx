import PropTypes from 'prop-types';
import './styles.css';
import { Link } from 'react-router-dom';

export const ButtonOutlineSecondary = ({ text, link }) => {
	return (
		<Link to={link} className="buttonOutlineSecondary pt-3 pb-3 pb-sm-0 text-center">
			{text}
		</Link>
	);
};

ButtonOutlineSecondary.propTypes = {
	text: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};
