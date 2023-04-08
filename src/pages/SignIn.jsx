import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { CustomLink } from '../components/CustomLink';
import { EmailLoginInput } from '../components/LoginInputs/EmailLoginInput';
import { PasswordLoginInput } from '../components/LoginInputs/PasswordLoginInput';

export const SignIn = () => {
	const [login, setLogin] = useState({
		email: '',
		password: '',
	});

	useEffect(() => {
		console.log(login);
	}, [login]);

	const updateForm = (inputName, event) => {
		setLogin((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	const logIn = () => {
		// Chama requisição tentando fazer login
		console.log('Cliquei');
	};

	return (
		<div className="container my-5 text-center custom-card">
			<h2>
				Entre no <span className="secondary-color">Family</span>Routine
			</h2>

			<p>
				Não tem cadastro? <CustomLink to="/signup" text="Cadastre-se" />
			</p>
			<div className="row text-end">
				<div className="col-12">
					<EmailLoginInput placeholder="E-mail" onChange={(e) => updateForm('email', e)} />
					<PasswordLoginInput placeholder="Senha" onChange={(e) => updateForm('password', e)} />
					<div className="my-3">
						<CustomLink to="/forgotpassword" text="Esqueceu sua senha?" />
					</div>
				</div>
			</div>
			<Button onClick={logIn} text="Entrar" />
		</div>
	);
};
