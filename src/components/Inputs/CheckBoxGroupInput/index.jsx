import PropTypes from 'prop-types';
import '../styles.css';
import { useEffect, useState } from 'react';

export const CheckBoxGroupInput = ({ label, options, onChange }) => {
	const [inputValues, setInputValues] = useState([]);

	useEffect(() => {
		const sendObj = {
			target: {
				value: inputValues,
			},
		};
		onChange(sendObj, inputValues);
	}, [inputValues]);

	const updateCheckBoxGroup = (e, value) => {
		let values = inputValues;
		if (e.target.checked) {
			if (!values.includes(value)) {
				values.push(value);
				setInputValues([...values]);
			}
		} else {
			values = values.filter((v) => v != value);
			setInputValues([...values]);
		}
	};

	return (
		<div className="mt-3">
			<label className="customLabel">{label}</label>
			<div className="btn-group row my-3 text-center" role="group">
				{options.map((option) => (
					<div className="col-6 col-sm-3 mt-2" key={`ckbox-${option.value}`}>
						<input
							name="inputCustom"
							type="checkbox"
							className="btn-check"
							id={`ckbox-${option.value}`}
							onChange={(e) => updateCheckBoxGroup(e, option.value)}
							key={`ckbox-${option.value}`}
						/>
						<label className="btn btn-outline-info w-100" htmlFor={`ckbox-${option.value}`}>
							{option.name}
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

CheckBoxGroupInput.propTypes = {
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		}),
	),
	onChange: PropTypes.func.isRequired,
};
