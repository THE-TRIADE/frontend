import { ButtonHeader } from '../ButtonHeader';
import PropTypes from 'prop-types';

export const TitlePages = ({ text, textButton, target }) => {
	return (
		<div className="my-5 mx-3 d-flex flex-row justify-content-between">
			<h3 className="pt-3 ">{text}</h3>
			<ButtonHeader text={textButton} target={target} />
		</div>
	);
};

TitlePages.propTypes = {
	text: PropTypes.string.isRequired,
	target: PropTypes.string.isRequired,
	textButton: PropTypes.string.isRequired,
};
