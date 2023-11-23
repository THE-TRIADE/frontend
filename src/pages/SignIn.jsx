import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components/Button';
import { CustomLink } from '../components/CustomLink';
import { CustomSpan } from '../components/CustomSpan';
import { FooterWave } from '../components/FooterWave';
import { EmailLoginInput } from '../components/LoginInputs/EmailLoginInput';
import { PasswordLoginInput } from '../components/LoginInputs/PasswordLoginInput';
import { api } from '../config/api';

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
				api(false)
					.post('/guardian/login', login)
					.then((res) => {
						toast.success('Usuário autenticado com sucesso.');
						sessionStorage.setItem('UserId', res.data.id);
						sessionStorage.setItem('token', res.data.token);
						navigate('/');
					})
					.catch((err) => {
						console.error(err);
						toast.error('Falha ao autenticar.');
					})
					.finally(() => setTrySignUp(false));
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
		<div className="app justify-content-center pb-5">
			<div className="container text-center custom-card pb-5">
				<h2>
					Entre no <span className="secondary-color">Family</span>Routine
				</h2>

				<p>
					Não tem cadastro? <CustomLink to="/signup" text="Cadastre-se" />
				</p>
				<div className="row text-start">
					<div className="col-12">
						<EmailLoginInput placeholder="E-mail" value={login.username} onChange={(e) => updateForm('username', e)} />
						{showErrorMessages('username')}
						<PasswordLoginInput
							placeholder="Senha"
							value={login.password}
							onChange={(e) => updateForm('password', e)}
						/>
						{showErrorMessages('password')}
						<div className="my-3 text-end">
							<CustomLink to="/forgotpassword" text="Esqueceu sua senha?" />
						</div>
					</div>
				</div>
				<Button onClick={logIn} text="Entrar" />
			</div>
			<FooterWave />
		</div>
	);
};
