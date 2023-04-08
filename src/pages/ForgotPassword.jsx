import { useState, useEffect } from 'react';

import { EmailLoginInput } from '../components/LoginInputs/EmailLoginInput';
import { Button } from '../components/Button';
import { CustomLink } from '../components/CustomLink';

export const ForgotPassword = () => {
	const [email, setEmail] = useState('');

	useEffect(() => {
		console.log(email);
	}, [email]);

	return (
		<div className="container my-5 text-center custom-card">
			<h2>Esqueceu a senha?</h2>
			<p>
				Insira seu <b>email</b> e receba um link para redefinir sua senha
			</p>
			<div className="my-4">
				<EmailLoginInput placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
				<Button onClick={() => console.log('Cliquei')} text="Enviar link para recuperação" />
			</div>

			<div className="mt-5">
				<CustomLink to="/login" text="Voltar para página de login" />
			</div>
		</div>
	);
};
