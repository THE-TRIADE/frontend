import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { CustomSpan } from '../components/CustomSpan';
import { TextualInput } from '../components/Inputs/TextualInput';
import { SelectInput } from '../components/Inputs/SelectInput';

import { api } from '../config/api';
import { ButtonOutline } from '../components/ButtonOutline';
import { DateInput } from '../components/Inputs/DateInput';
import { CpfInput } from '../components/Inputs/CpfInput';

export const FamilyGroup = () => {
	const [familyGroupForm, setfamilyGroupForm] = useState({
		name: '',
		guardianPaper: '',
		guardianPartner: '',
		dependentName: '',
		dependentCpf: '',
		dependentBirthDate: '',
	});
	const [errorMessages, setErrorMessages] = useState({
		name: null,
		guardianPaper: null,
		guardianPartner: null,
		dependentName: null,
		dependentCpf: null,
		dependentBirthDate: null,
	});

	useEffect(() => {
		clearValidationFields();
	}, []);

	const [option, setOption] = useState('A');

	const updateForm = (inputName, event) => {
		setfamilyGroupForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { ...errorMessages };

		for (const [key, value] of Object.entries(familyGroupForm)) {
			if (isEmpty(value)) {
				newErrorMessages[key] = 'Este campo não pode ser vazio';
			}
		}
		if (familyGroupForm.dependentCpf.length != 11) {
			newErrorMessages.dependentCpf = 'CPF inválido';
		}
		if (!familyGroupForm.guardianPartner.includes('@')) {
			newErrorMessages.guardianPartner = 'Email inválido';
		}

		setErrorMessages(newErrorMessages);
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: null,
			guardianPaper: null,
			guardianPartner: null,
			dependentName: null,
			dependentCpf: null,
			dependentBirthDate: null,
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

	const teste = () => {
		console.log('teste');
	};

	const showErrorMessages = (field) => {
		if (errorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={errorMessages[field]} />;
		}
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
							<SelectInput
								options={['Mãe', 'Pai', 'Parente', 'Provisório']}
								value={option}
								label="Papel no grupo familiar"
								onChange={(e) => setOption(e.target.value)}
							/>
							{showErrorMessages('guardianPaper')}

							<TextualInput
								placeholder="Email"
								label="Email do parceiro de tutela"
								value={familyGroupForm.guardianPartner}
								onChange={(e) => updateForm('guardianPartner', e)}
							/>
							{showErrorMessages('guardianPartner')}
							<h5 className="text-center mt-5 text-secondary">Cadastro de dependete(s)</h5>
							<b className="text-start h5">Dependente 1</b>
							<TextualInput
								placeholder="Nome"
								label="Nome do dependente"
								value={familyGroupForm.dependentName}
								onChange={(e) => updateForm('dependentName', e)}
							/>
							{showErrorMessages('dependentName')}
							<CpfInput
								placeholder="CPF"
								value={familyGroupForm.cpf}
								label="CPF do dependente"
								onChange={(e) => updateForm('dependentCpf', e)}
							/>

							{showErrorMessages('dependentCpf')}
							<DateInput
								label="Data de Nascimento"
								placeholder="00/00/0000"
								value={familyGroupForm.dependentBirthDate}
								onChange={(e) => updateForm('dependentBirthDate', e)}
							/>
							{showErrorMessages('dependentBirthDate')}
							<div className="my-3 text-end">
								<ButtonOutline onClick={teste} text="Adicionar dependente +" />
							</div>

							<Button onClick={submitFamilyGroupForm} text="Finalizar Cadastro" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
