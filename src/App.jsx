import { useEffect, useState } from 'react';
import { Button } from './components/Button';
import { PasswordLoginInput } from './components/LoginInputs/PasswordLoginInput';
import { TextualLoginInput } from './components/LoginInputs/TextualLoginInput';
import { SelectLoginInput } from './components/LoginInputs/SelectLoginInput';
import { CustomLink } from './components/CustomLink';
import { TextualInput } from './components/Inputs/TextualInput';

function App() {
	const [signUpForm, setSignUpForm] = useState({
		name: '',
		email: '',
		cpf: '',
		birthDate: '',
		password: '',
	});

	const [option, setOption] = useState('A');

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
			<SelectLoginInput
				options={['A', 'B', 'C']}
				value={option}
				onChange={(e) => setOption(e.target.value)}
				size="large"
			/>
			<CustomLink href="www.google.com" text="Voltar para página inicial" target="_blank" />
			<TextualInput label="Email" placeholder="E-mail" onChange={(e) => updateForm('email', e)} size="large" />
			<h4>Dependente 1</h4>
			<Button onClick={() => console.log('Cliquei')} text="Cadastrar" size="large" />
		</div>
	);
}

export default App;
