import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { CustomLink } from '../components/CustomLink';
import { EmailLoginInput } from '../components/LoginInputs/EmailLoginInput';
import { PasswordLoginInput } from '../components/LoginInputs/PasswordLoginInput';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { CustomSpan } from '../components/CustomSpan';

export const SignIn = () => {
	const [login, setLogin] = useState({
		username: '',
		password: '',
	});
	const [errorMessages, setErrorMessages] = useState({
		username: null,
		password: null,
	});
	const [trySignUp, setTrySignUp] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		clearValidationFields();
	}, []);

	useEffect(() => {
		if (trySignUp) {
			const newErrorMessages = validateForm();
			let isValid = true;
			Object.values(newErrorMessages).forEach((errors) => {
				if (errors !== null) {
					isValid = false;
				}
			});

			if (isValid) {
				api
					.post('/guardian/login', login)
					.then((res) => {
						console.log(res);

						navigate('/familygroup');
					})
					.catch((err) => console.error(err));
			} else {
				setTrySignUp(false);
			}
		}
	}, [trySignUp]);

	const updateForm = (inputName, event) => {
		setLogin((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const logIn = () => {
		clearValidationFields();
		setTrySignUp(true);
	};

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { ...errorMessages };

		for (const [key, value] of Object.entries(login)) {
			if (isEmpty(value)) {
				newErrorMessages[key] = 'Este campo não pode ser vazio';
			}
		}

		if (!login.username.includes('@')) {
			newErrorMessages.username = 'Email inválido';
		}

		setErrorMessages(newErrorMessages);
		return newErrorMessages;
	};

	const clearValidationFields = () => {
		setErrorMessages({
			username: null,
			password: null,
		});
	};

	const showErrorMessages = (field) => {
		if (errorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={errorMessages[field]} />;
		}
	};

	return (
		<div className="container my-5 text-center custom-card">
			<h2>
				Entre no <span className="secondary-color">Family</span>Routine
			</h2>

			<p>
				Não tem cadastro? <CustomLink to="/signup" text="Cadastre-se" />
			</p>
			<div className="row text-start">
				<div className="col-12">
					<EmailLoginInput placeholder="E-mail" onChange={(e) => updateForm('username', e)} />
					{showErrorMessages('username')}
					<PasswordLoginInput placeholder="Senha" onChange={(e) => updateForm('password', e)} />
					{showErrorMessages('password')}
					<div className="my-3 text-end">
						<CustomLink to="/forgotpassword" text="Esqueceu sua senha?" />
					</div>
				</div>
			</div>
			<Button onClick={logIn} text="Entrar" />
		</div>
	);
};
