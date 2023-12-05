import { useState, useEffect } from 'react';
import { DateInput } from '../Inputs/DateInput';
import { CpfInput } from '../Inputs/CpfInput';
import { TextualInput } from '../Inputs/TextualInput';
import { ButtonOutline } from '../ButtonOutline';
import PropTypes from 'prop-types';
export const DependentForm = ({ counter, updateDependent, updateDependentCount, initialValue = null }) => {
	const [dependent, setDependent] = useState({
		name: initialValue != null ? initialValue.name : '',
		cpf: initialValue != null ? initialValue.cpf : '',
		birthDate: initialValue != null ? initialValue.birthDate : '',
	});

	const updateForm = (inputName, event) => {
		setDependent((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	useEffect(() => {
		const newDependent = { ...dependent, cpf: dependent.cpf.replace(/\D/g, '') };
		updateDependent(newDependent, counter - 1);
	}, [dependent]);

	return (
		<>
			<div className="pt-4 d-flex flex-row justify-content-between">
				<b className="text-start h5">Dependente {counter}</b>
				{counter > 1 && <ButtonOutline onClick={() => updateDependentCount((ps) => ps - 1)} text="Excluir" />}
			</div>
			<TextualInput
				placeholder="Nome"
				label="Nome do dependente"
				value={dependent.name}
				onChange={(e) => updateForm('name', e)}
				required
			/>
			<CpfInput
				placeholder="CPF"
				value={dependent.cpf}
				label="CPF do dependente"
				onChange={(e) => updateForm('cpf', e)}
				required
			/>
			<DateInput
				label="Data de Nascimento"
				placeholder="00/00/0000"
				value={dependent.birthDate}
				onChange={(e) => updateForm('birthDate', e)}
				required
			/>
		</>
	);
};

DependentForm.propTypes = {
	counter: PropTypes.number.isRequired,
	updateDependentCount: PropTypes.func.isRequired,
	updateDependent: PropTypes.func.isRequired,
	initialValue: PropTypes.object,
};
