import { useState } from 'react';

function App() {

	let contador = 0;
  const [count, setCount] = useState(0);

	const aumentarContador = () => {
		contador = contador + 1;
		console.log(contador);
	}
  // Returns a stateful value, and a function to update it.
	// useState<number>(initialState: number | (() => number)):
	// [number, React.Dispatch<React.SetStateAction<number>>]


  return (
    <div className="App">
			<h1>Aulinha 1: Estados</h1>
			<button onClick={() => setCount((count) => count + 1)}>
				Contador via estado: {count}
			</button>
			<button onClick={aumentarContador}>
				Contador via JS: {contador}
			</button>
    </div>
  )
}

export default App;




