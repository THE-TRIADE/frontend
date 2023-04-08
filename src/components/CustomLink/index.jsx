import PropTypes from 'prop-types';
import './styles.css';
import { Link } from 'react-router-dom';

export const CustomLink = ({ to, text }) => {
	return (
		<Link className="customLink " to={to}>
			{text}
		</Link>
	);
};

CustomLink.propTypes = {
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};
