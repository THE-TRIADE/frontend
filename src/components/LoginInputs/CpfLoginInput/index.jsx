import PropTypes from 'prop-types';
import '../styles.css';
import ReactInputMask from 'react-input-mask';

export const CpfLoginInput = ({ value, onChange, placeholder }) => {
	return (
		<ReactInputMask mask="999.999.999-99" value={value} onChange={(e) => onChange(e)}>
			{() => <input type="text" className="loginInput form-control mt-3 mb-2" placeholder={placeholder} />}
		</ReactInputMask>
	);
};

CpfLoginInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
