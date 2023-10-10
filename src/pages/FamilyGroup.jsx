import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { CustomSpan } from '../components/CustomSpan';
import { TextualInput } from '../components/Inputs/TextualInput';
import { api } from '../config/api';
import { ButtonOutline } from '../components/ButtonOutline';
import { DependentForm } from '../components/DependentForm';
import { useNavigate } from 'react-router-dom';
import { guardianRoleEnum } from './ManageGuardians';
import { SelectInput } from '../components/Inputs/SelectInput';
import { toast } from 'react-toastify';

export const FamilyGroup = () => {
	const [familyGroupForm, setFamilyGroupForm] = useState({
		name: '',
		guardianId: sessionStorage.getItem('UserId'),
		guardianRole: '-1',
	});
	const [dependents, setDependents] = useState([]);
	const [errorMessages, setErrorMessages] = useState({
		name: null,
		guardianRole: null,
		dependents: [],
	});
	const [dependentCount, setDependentCount] = useState(1);
	const [submit, setSubmit] = useState(false);
	const navigate = useNavigate();

	const validateForm = () => {
		let isValid = true;

		const newErrorMessages = { name: null, guardianRole: null, dependents: [] };

		if (familyGroupForm.name.trim() === '') {
			newErrorMessages.name = 'Este campo não pode ser vazio';
			isValid = false;
		}

		if (familyGroupForm.guardianRole === '-1') {
			newErrorMessages.guardianRole = 'Por favor, selecione um papel';
			isValid = false;
		}

		const dependentErrors = [];
		dependents.forEach((dependent, index) => {
			const errors = {};

			if (
				dependent.name.trim() === '' ||
				dependent.birthDate.trim() === '' ||
				dependent.cpf.replace(/\D/g, '').length < 11
			) {
				errors.message = `Dependente ${index + 1}: Todos os campos devem ser preenchidos`;
				isValid = false;
			}

			dependentErrors.push(errors);
		});

		newErrorMessages.dependents = dependentErrors;
		setErrorMessages(newErrorMessages);
		return isValid;
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: null,
			guardianRole: null,
			dependents: [],
		});
	};

	const submitFamilyGroupForm = () => {
		clearValidationFields();
		setSubmit(true);

		if (validateForm()) {
			const newFamilyGroup = { ...familyGroupForm, dependents };
			api
				.post('/familyGroup', newFamilyGroup)
				.then(() => {
					toast.success('Grupo familiar criado com sucesso.');
					navigate('/');
				})
				.catch((err) => {
					console.error(err);
					toast.error('Falha ao criar grupo familiar.');
				});
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
								onChange={(e) => setFamilyGroupForm({ ...familyGroupForm, name: e.target.value })}
								required
							/>
							{errorMessages.name && <CustomSpan text={errorMessages.name} />}
							<SelectInput
								options={[
									{ optName: 'Escolha um papel', optValue: '-1', disabled: true },
									...guardianRoleEnum.map((role) => {
										return { optName: role.key, optValue: role.value.toString() };
									}),
								]}
								value={familyGroupForm.guardianRole}
								label="Papel do responsável"
								required
								onChange={(e) => setFamilyGroupForm({ ...familyGroupForm, guardianRole: e.target.value })}
							/>
							{errorMessages.guardianRole && <CustomSpan text={errorMessages.guardianRole} />}
							<h5 className="text-center mt-5 text-secondary">Cadastro de dependente(s)</h5>
							<div className="my-3 text-start">
								{Array.from({ length: dependentCount }).map((_, index) => (
									<DependentForm
										counter={index + 1}
										showErrorMessages={errorMessages.dependents[index] || {}}
										updateDependentCount={setDependentCount}
										updateDependent={(newDependent) => {
											const updatedDependents = [...dependents];
											updatedDependents[index] = newDependent;
											setDependents(updatedDependents);
										}}
										key={'kdf' + index}
									/>
								))}
								{errorMessages.dependents &&
									errorMessages.dependents.map((errors, index) => {
										return errors.message ? (
											<div>
												<CustomSpan key={`error-${index}`} text={errors.message} />{' '}
											</div>
										) : null;
									})}
								<div>
									<ButtonOutline onClick={() => setDependentCount((ps) => ps + 1)} text="Adicionar dependente +" />
								</div>
							</div>

							<Button onClick={submitFamilyGroupForm} text="Finalizar Cadastro" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
