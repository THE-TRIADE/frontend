import PropTypes from 'prop-types';
import '../styles.css';
import { useRef } from 'react';

export const DateLoginInput = ({ value, onChange, placeholder }) => {
	const today = useRef(
		`${new Date(Date.now()).getFullYear()}-${String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')}-${String(
			new Date(Date.now()).getDate(),
		).padStart(2, '0')}`,
	);

	return (
		<input
			type="date"
			className="loginInput form-control mt-3 mb-2"
			placeholder={placeholder}
			max={today.current}
			value={value}
			onChange={onChange}
		/>
	);
};

DateLoginInput.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string.isRequired,
};
