import { useState, useEffect } from 'react';
import { DateInput } from '../Inputs/DateInput';
import { CpfInput } from '../Inputs/CpfInput';
import { TextualInput } from '../Inputs/TextualInput';
import { ButtonOutline } from '../ButtonOutline';
import PropTypes from 'prop-types';
export const DependentForm = ({ counter, updateDependent, updateDependentCount }) => {
	const [dependent, setDependent] = useState({
		name: '',
		cpf: '',
		birthDate: '',
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
			<b className="text-start h5">Dependente {counter}</b>
			{counter > 1 && <ButtonOutline onClick={() => updateDependentCount((ps) => ps - 1)} text="Excluir" />}
			<TextualInput
				placeholder="Nome"
				label="Nome do dependente"
				value={dependent.name}
				onChange={(e) => updateForm('name', e)}
			/>
			<CpfInput
				placeholder="CPF"
				value={dependent.cpf}
				label="CPF do dependente"
				onChange={(e) => updateForm('cpf', e)}
			/>
			<DateInput
				label="Data de Nascimento"
				placeholder="00/00/0000"
				value={dependent.birthDate}
				onChange={(e) => updateForm('birthDate', e)}
			/>
		</>
	);
};

DependentForm.propTypes = {
	counter: PropTypes.number.isRequired,
	updateDependentCount: PropTypes.func.isRequired,
	updateDependent: PropTypes.func.isRequired,
};
