// Importando hooks do React
import { useEffect, useState } from 'react';
// Importando CSS
import './teste.css';

// Função JavaScript
export const Teste = () => {

	// Estados
	const [estado, setEstado] = useState("teste");

	// Efeitos colaterais
	useEffect(() => {
		//
	}, []);

	// HTML (JSX)
	return (
		<div className='testando'>
			<p>teste + {estado}</p>
		</div>
	);
}









// Tipos de função em JS
function name(params) {
	//
}

var name2 = function(params) {
	//
}
								// = + > --> =>
const name3 = (params) => {
	//
}
