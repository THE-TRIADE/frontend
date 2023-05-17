import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { CustomSpan } from '../components/CustomSpan';
import { TextualInput } from '../components/Inputs/TextualInput';

import { api } from '../config/api';
import { ButtonOutline } from '../components/ButtonOutline';
import { DateInput } from '../components/Inputs/DateInput';
import { CpfInput } from '../components/Inputs/CpfInput';

export const FamilyGroup = () => {
	const [familyGroupForm, setfamilyGroupForm] = useState({
		name: '',
		dependents: [
			{
				dependentName: '',
				dependentCpf: '',
				dependentBirthDate: '',
			},
		],
	});
	const [errorMessages, setErrorMessages] = useState({
		name: null,
	});
	const [dependentCount, setDependentCount] = useState(1);

	useEffect(() => {
		clearValidationFields();
	}, []);

	useEffect(() => {
		if (familyGroupForm.dependents.length < dependentCount) {
			for (let count = familyGroupForm.dependents.length; count < dependentCount; count++) {
				setfamilyGroupForm((prevState) => {
					const newDependentForm = {
						dependentName: '',
						dependentCpf: '',
						dependentBirthDate: '',
					};
					const newDependentsArray = [...prevState.dependents, newDependentForm];
					return { ...prevState, dependents: newDependentsArray };
				});
			}
		}
		if (familyGroupForm.dependents.length > dependentCount) {
			for (let count = familyGroupForm.dependents.length; count > dependentCount; count--) {
				setfamilyGroupForm((prevState) => {
					const newArray = prevState.dependents.slice(0, -1);
					return { ...prevState, dependents: newArray };
				});
			}
		}
	}, [dependentCount]);

	useEffect(() => {
		console.log(familyGroupForm);
	}, [familyGroupForm]);

	const updateForm = (inputName, event) => {
		setfamilyGroupForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const updateDependentForm = (inputName, event, index) => {
		let value = event.target.value;

		setfamilyGroupForm((prevState) => {
			const updatedDependents = prevState.dependents.map((dependent, i) => {
				if (i === index) {
					if (inputName == 'dependentCpf') {
						value = event.target.value.replace(/\D/g, '');
					}
					return { ...dependent, [inputName]: value };
				}
				return dependent;
			});

			return { ...prevState, dependents: updatedDependents };
		});
	};

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { ...errorMessages };

		if (isEmpty(familyGroupForm.name)) {
			newErrorMessages.name = 'Este campo não pode ser vazio';
		}
		for (let i = 0; i < familyGroupForm.dependents.length; i++) {
			if (isEmpty(familyGroupForm.dependents[i].dependentName)) {
				const key = `dependentName${i + 1}`;
				newErrorMessages[key] = 'Este campo não pode ser vazio';
			}
			if (familyGroupForm.dependents[i].dependentCpf.length != 11) {
				const key = `dependentCpf${i + 1}`;
				newErrorMessages[key] = 'CPF inválido';
			}
			if (isEmpty(familyGroupForm.dependents[i].dependentBirthDate)) {
				const key = `dependentBirthDate${i + 1}`;
				newErrorMessages[key] = 'Este campo não pode ser vazio';
			}
		}
		setErrorMessages(newErrorMessages);
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: null,
		});
	};

	const submitFamilyGroupForm = () => {
		clearValidationFields();
		validateForm();
		let isValid = true;
		Object.values(errorMessages).forEach((errors) => {
			if (errors !== null) {
				isValid = false;
			}
		});

		if (isValid) {
			const newFamilyGroup = { ...familyGroupForm };
			api
				.post('/familyGroup', newFamilyGroup)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => console.error(err));
		}
	};

	const showErrorMessages = (field) => {
		if (errorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={errorMessages[field]} />;
		}
	};

	// eslint-disable-next-line react/prop-types
	const DependentForm = ({ counter, onchange }) => {
		return (
			<>
				<b className="text-start h5">Dependente {counter}</b>
				{counter > 1 && (
					<b className="text-danger">
						<ButtonOutline onClick={() => setDependentCount((ps) => ps - 1)} text="Excluir" />
					</b>
				)}
				<TextualInput
					placeholder="Nome"
					label="Nome do dependente"
					value={familyGroupForm.dependents[counter - 1].dependentName}
					onChange={(e) => onchange('dependentName', e, counter - 1)}
				/>
				{showErrorMessages('dependentName' + counter)}
				<CpfInput
					placeholder="CPF"
					value={familyGroupForm.dependents[counter - 1].dependentCpf}
					label="CPF do dependente"
					onChange={(e) => onchange('dependentCpf', e, counter - 1)}
				/>
				{showErrorMessages('dependentCpf' + counter)}
				<DateInput
					label="Data de Nascimento"
					placeholder="00/00/0000"
					value={familyGroupForm.dependents[counter - 1].dependentBirthDate}
					onChange={(e) => onchange('dependentBirthDate', e, counter - 1)}
				/>
				{showErrorMessages('dependentBirthDate' + counter)}
			</>
		);
	};

	return (
		<div className="app">
			<div className="container my-5 text-center custom-card">
				<h1 className="secondary-color">Bem-vindo!</h1>
				<p>Vamos iniciar o cadastro do seu grupo familiar</p>
				<div className="row text-start">
					<div className="col-12">
						<div className="mt-3">
							<TextualInput
								placeholder="Nome"
								label="Nome do grupo familiar"
								value={familyGroupForm.name}
								onChange={(e) => updateForm('name', e)}
							/>
							{showErrorMessages('name')}
							<h5 className="text-center mt-5 text-secondary">Cadastro de dependente(s)</h5>

							<div className="my-3 text-start">
								{familyGroupForm.dependents.map((df, index) => (
									<DependentForm counter={index + 1} onchange={updateDependentForm} key={'kdf' + index} />
								))}
								<ButtonOutline onClick={() => setDependentCount((ps) => ps + 1)} text="Adicionar dependente +" />
							</div>
							<Button onClick={submitFamilyGroupForm} text="Finalizar Cadastro" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
