// Importando hooks do React
import { useEffect, useState } from 'react';
// Importando CSS
import './teste.css';

// Função JavaScript
export const Teste = () => {
	// Estados
	const [estado, setEstado] = useState('teste 2');

	// Efeitos colaterais
	useEffect(() => {
		//
	}, []);

	// HTML (JSX)
	return (
		<div className="testando">
			<p>teste + {estado}</p>
			<input type="text" id="teste" onBlur={(e) => setEstado(e.target.value)} />
		</div>
	);
};
