import PropTypes from 'prop-types';
import './styles.css';

export const CustomLink = ({ href, target, text }) => {
	return (
		<a className="customLink" href={href} target={target}>
			{text}
		</a>
	);
};

CustomLink.propTypes = {
	target: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};
