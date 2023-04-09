import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { PasswordLoginInput } from '../components/LoginInputs/PasswordLoginInput';
import { TextualLoginInput } from '../components/LoginInputs/TextualLoginInput';
import { EmailLoginInput } from '../components/LoginInputs/EmailLoginInput';
import { DateLoginInput } from '../components/LoginInputs/DateLoginInput';
import { CpfLoginInput } from '../components/LoginInputs/CpfLoginInput';
import { CustomLink } from '../components/CustomLink';
import { CustomSpan } from '../components/CustomSpan';

import { api } from '../config/api';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
	const [signUpForm, setSignUpForm] = useState({
		name: '',
		email: '',
		cpf: '',
		birthDate: '',
		password: '',
		passwordConfirmation: '',
	});
	const [errorMessages, setErrorMessages] = useState({
		name: null,
		email: null,
		cpf: null,
		birthDate: null,
		password: null,
		passwordConfirmation: null,
	});

	const navigate = useNavigate();

	useEffect(() => {
		clearValidationFields();
	}, []);

	const updateForm = (inputName, event) => {
		setSignUpForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { ...errorMessages };

		for (const [key, value] of Object.entries(signUpForm)) {
			if (isEmpty(value)) {
				newErrorMessages[key] = 'Este campo não pode ser vazio';
			}
		}

		if (signUpForm.name.match(/\d/g) != null) {
			newErrorMessages.name = 'Nome não pode conter números';
		}

		if (signUpForm.cpf.length != 11) {
			newErrorMessages.cpf = 'CPF inválido';
		}

		if (signUpForm.password !== signUpForm.passwordConfirmation) {
			newErrorMessages.passwordConfirmation = 'Senhas não coincidem';
		}

		setErrorMessages(newErrorMessages);
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: null,
			email: null,
			cpf: null,
			birthDate: null,
			password: null,
			passwordConfirmation: null,
		});
	};

	const submitSignUpForm = () => {
		clearValidationFields();
		validateForm();
		let isValid = true;
		Object.values(errorMessages).forEach((errors) => {
			if (errors !== null) {
				isValid = false;
			}
		});

		if (isValid) {
			const newGuardian = { ...signUpForm };
			delete newGuardian.passwordConfirmation;
			api
				.post('/guardian', newGuardian)
				.then((res) => {
					console.log(res);
					navigate('/');
				})
				.catch((err) => console.error(err));
		}
	};

	const showErrorMessages = (field) => {
		if (errorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={errorMessages[field]} />;
		}
	};

	return (
		<div className="app">
			<div className="container my-5 text-center custom-card">
				<h1>Cadastro</h1>
				<p>
					Cadastre-se e tenha acesso ao <b>Family</b>Routine
				</p>
				<div className="row text-start">
					<div className="col-12">
						<TextualLoginInput placeholder="Nome" onChange={(e) => updateForm('name', e)} />
						{showErrorMessages('name')}
						<EmailLoginInput placeholder="E-mail" onChange={(e) => updateForm('email', e)} />
						{showErrorMessages('email')}
						<CpfLoginInput placeholder="CPF" value={signUpForm.cpf} onChange={(e) => updateForm('cpf', e)} />
						{showErrorMessages('cpf')}
						<DateLoginInput placeholder="Data de Nascimento" onChange={(e) => updateForm('birthDate', e)} />
						{showErrorMessages('birthDate')}
						<PasswordLoginInput
							placeholder="Senha"
							value={signUpForm.password}
							onChange={(e) => updateForm('password', e)}
						/>
						{showErrorMessages('password')}
						<PasswordLoginInput
							value={signUpForm.passwordConfirmation}
							placeholder="Confirmar Senha"
							onChange={(e) => updateForm('passwordConfirmation', e)}
						/>
						{showErrorMessages('passwordConfirmation')}
						<div className="mt-3">
							<Button onClick={submitSignUpForm} text="Cadastrar" />
						</div>
					</div>
				</div>
				<div className="mt-5">
					<CustomLink to="/login" text="Voltar para página de login" />
				</div>
			</div>
		</div>
	);
};
