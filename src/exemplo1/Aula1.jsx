import { useState } from 'react';

export const Aula1 = () => {
	let contador = 0;
	// Returns a stateful value, and a function to update it.
	// useState<number>(initialState: number | (() => number)):
	// [number, React.Dispatch<React.SetStateAction<number>>]
	const [count, setCount] = useState(0);

	const incrementCount = () => {
		setCount((count) => count + 1);
	};

	const aumentarContador = () => {
		contador = contador + 1;
		console.log(contador);
	};

	return (
		<div className="App">
			<h1>Aulinha 1: Estados</h1>
			<button onClick={incrementCount}>Contador via estado: {count}</button>
			<button onClick={aumentarContador}>Contador via JS: {contador}</button>
		</div>
	);
};
