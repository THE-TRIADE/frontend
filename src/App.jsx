import { useEffect, useState } from 'react';
import { TextualLoginInput } from './components/LoginInputs/TextualLoginInput';
import { PasswordLoginInput } from './components/LoginInputs/PasswordLoginInput';
import { Button } from './components/Button';

function App() {
	const [signUpForm, setSignUpForm] = useState({
		name: '',
		email: '',
		cpf: '',
		birthDate: '',
		password: '',
	});

	useEffect(() => {
		console.log(signUpForm);
	}, [signUpForm]);

	const updateForm = (inputName, event) => {
		setSignUpForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	return (
		<div className="app">
			<h2>Cadastro</h2>
			<p>
				Cadastre-se e tenha acesso ao <b>Family</b>Routine
			</p>
			<TextualLoginInput placeholder="Nome" onChange={(e) => updateForm('name', e)} size="large" />
			<TextualLoginInput placeholder="E-mail" onChange={(e) => updateForm('email', e)} size="large" />
			<TextualLoginInput placeholder="CPF" onChange={(e) => updateForm('cpf', e)} size="large" />
			<TextualLoginInput placeholder="Data de Nascimento" onChange={(e) => updateForm('birthDate', e)} size="large" />
			<PasswordLoginInput placeholder="Senha" onChange={(e) => updateForm('password', e)} size="large" />
			<PasswordLoginInput
				placeholder="Confirmar Senha"
				onChange={(e) => console.log('Confirmar senha: ' + e.target.value)}
				size="large"
			/>
			<Button onClick={() => console.log('Cliquei')} text="Cadastrar" size="large" />
			{FooterSVG}
		</div>
	);
}

export default App;

const FooterSVG = (
	<svg width="1278" height="111" viewBox="0 0 1278 111" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 0L53 4.17052C107 8.34104 213 16.6821 320 30.7977C427 45.2341 533 65.7659 640 69.9364C747 74.1069 853 61.5954 960 57.7457C1067 53.5751 1173 57.7457 1227 59.6705L1280 61.5954V111H1227C1173 111 1067 111 960 111C853 111 747 111 640 111C533 111 427 111 320 111C213 111 107 111 53 111H0V0Z"
			fill="#03A7B8"
			fillOpacity="0.4"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 44.4L42.6667 53.28C85.3333 62.16 170.667 79.92 256 75.48C341.333 71.04 426.667 44.4 512 26.64C597.333 8.88 682.667 0 768 0C853.333 0 938.667 8.88 1024 24.42C1109.33 39.96 1194.67 62.16 1237.33 73.26L1280 84.36V111H1237.33C1194.67 111 1109.33 111 1024 111C938.667 111 853.333 111 768 111C682.667 111 597.333 111 512 111C426.667 111 341.333 111 256 111C170.667 111 85.3333 111 42.6667 111H0V44.4Z"
			fill="#03A7B8"
			fillOpacity="0.4"
		/>
	</svg>
);
