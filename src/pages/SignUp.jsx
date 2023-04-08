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
		name: [],
		email: [],
		cpf: [],
		birthDate: [],
		password: [],
	});

	useEffect(() => {
		clearValidationFields();
	}, []);

	const updateForm = (inputName, event) => {
		setSignUpForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const isEmpty = (text) => text.trim() == '';

	const validateForm = () => {
		if (isEmpty(signUpForm.name)) {
			setErrorMessages((prevState) => {
				return { ...prevState, name: [...prevState.name, 'Nome não pode ser vazio'] };
			});
		}
		if (!isEmpty(signUpForm.name)) {
			if (signUpForm.name.match(/\d/g) != null) {
				setErrorMessages((prevState) => {
					return { ...prevState, name: [...prevState.name, 'Nome não pode conter números'] };
				});
			}
		}
		if (isEmpty(signUpForm.email)) {
			setErrorMessages((prevState) => {
				return { ...prevState, email: [...prevState.email, 'Email não pode ser vazio'] };
			});
		}
		if (isEmpty(signUpForm.cpf)) {
			setErrorMessages((prevState) => {
				return { ...prevState, cpf: [...prevState.cpf, 'CPF não pode ser vazio'] };
			});
		}
		if (!isEmpty(signUpForm.cpf) && signUpForm.cpf.length != 11) {
			setErrorMessages((prevState) => {
				return { ...prevState, cpf: [...prevState.cpf, 'CPF inválido'] };
			});
		}
		if (isEmpty(signUpForm.birthDate)) {
			setErrorMessages((prevState) => {
				return { ...prevState, birthDate: [...prevState.birthDate, 'Data de nascimento não pode ser vazia'] };
			});
		}
		if (isEmpty(signUpForm.password)) {
			setErrorMessages((prevState) => {
				return { ...prevState, password: [...prevState.password, 'Senha não pode ser vazia'] };
			});
		}
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: [],
			email: [],
			cpf: [],
			birthDate: [],
			password: [],
		});
	};

	const submitSignUpForm = () => {
		clearValidationFields();
		validateForm();
		let isValid = true;
		Object.keys(errorMessages).forEach((key) => {
			if (errorMessages[key].length) {
				isValid = false;
			}
		});

		if (isValid) {
			const newGuardian = signUpForm;
			delete newGuardian.passwordConfirmation;
			api
				.post('/guardian', newGuardian)
				.then((res) => console.log(res))
				.catch((err) => console.error(err));
		}
	};

	const showErrorMessages = (field) => {
		if (errorMessages[field].length) {
			return errorMessages[field].map((fieldError, index) => (
				<CustomSpan key={'error-' + field + '-' + index} text={fieldError} />
			));
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
						<CpfLoginInput placeholder="CPF" onChange={(e) => updateForm('cpf', e)} />
						{showErrorMessages('cpf')}
						<DateLoginInput placeholder="Data de Nascimento" onChange={(e) => updateForm('birthDate', e)} />
						{showErrorMessages('birthDate')}
						<PasswordLoginInput placeholder="Senha" onChange={(e) => updateForm('password', e)} />
						{showErrorMessages('password')}
						<PasswordLoginInput placeholder="Confirmar Senha" onChange={(e) => updateForm('passwordConfirmation', e)} />
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
