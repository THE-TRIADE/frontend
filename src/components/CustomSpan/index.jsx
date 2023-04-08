import PropTypes from 'prop-types';
import './styles.css';

export const CustomSpan = ({ text }) => {
	return <span className="customSpan mt-2 text-left">{text}</span>;
};

CustomSpan.propTypes = {
	text: PropTypes.string.isRequired,
};
