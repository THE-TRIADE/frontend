import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { CustomSpan } from '../components/CustomSpan';
import { TextualInput } from '../components/Inputs/TextualInput';

import { api } from '../config/api';
import { ButtonOutline } from '../components/ButtonOutline';
import { DependentForm } from '../components/DependentForm';
import { useNavigate } from 'react-router-dom';
import { guardianRoleEnum } from './ManageGuardians';
import { SelectInput } from '../components/Inputs/SelectInput';

export const FamilyGroup = () => {
	const [familyGroupForm, setfamilyGroupForm] = useState({
		name: '',
		guardianId: sessionStorage.getItem('UserId'),
		guardianRole: '-1',
	});
	const [dependents, setDependents] = useState([]);
	const [errorMessages, setErrorMessages] = useState({
		name: null,
	});
	const [dependentCount, setDependentCount] = useState(1);
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		clearValidationFields();
	}, []);

	useEffect(() => {
		console.log('Dependents', dependents);
	}, [dependents]);

	useEffect(() => {
		if (dependents.length > dependentCount) {
			setDependents((ps) => [...ps.slice(0, -1)]);
		}
	}, [dependentCount]);
	const navigate = useNavigate();
	useEffect(() => {
		if (submit) {
			const newErrors = validateForm();
			let isValid = true;
			Object.values(newErrors).forEach((errors) => {
				if (errors !== null) {
					isValid = false;
				}
			});

			if (isValid) {
				const newFamilyGroup = { ...familyGroupForm, dependents };
				api
					.post('/familyGroup', newFamilyGroup)
					.then(() => {
						navigate('/');
					})
					.catch((err) => console.error(err));
			}
		}
		setSubmit(false);
	}, [submit]);

	const updateForm = (inputName, event) => {
		setfamilyGroupForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { ...errorMessages };
		if (isEmpty(familyGroupForm.name)) {
			newErrorMessages.name = 'Este campo não pode ser vazio';
		}
		setErrorMessages(newErrorMessages);
		return newErrorMessages;
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: null,
		});
	};

	const submitFamilyGroupForm = () => {
		clearValidationFields();
		setSubmit(true);
	};

	const showErrorMessages = (field) => {
		if (errorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={errorMessages[field]} />;
		}
	};

	const updateDependent = (newDependent, index) => {
		setDependents((ps) => {
			if (index >= 0 && index < ps.length) {
				ps[index] = newDependent;
			} else {
				ps.push(newDependent);
			}
			return [...ps];
		});
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
								options={[
									{ optName: 'Escolha um papel', optValue: '-1', disabled: true },
									...guardianRoleEnum.map((role) => {
										return { optName: role.key, optValue: role.value.toString() };
									}),
								]}
								value={familyGroupForm.guardianRole}
								label="Papel do responsável"
								onChange={(e) => updateForm('guardianRole', e)}
							/>
							<h5 className="text-center mt-5 text-secondary">Cadastro de dependente(s)</h5>

							<div className="my-3 text-start">
								{Array.from({ length: dependentCount }).map((_, index) => (
									<DependentForm
										counter={index + 1}
										showErrorMessages={showErrorMessages}
										updateDependentCount={setDependentCount}
										updateDependent={updateDependent}
										key={'kdf' + index}
									/>
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
