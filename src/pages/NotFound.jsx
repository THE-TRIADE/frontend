import { FooterWave } from '../components/FooterWave';
import { Menu } from '../components/Menu';

export const NotFound = () => {
	return (
		<div className="app justify-content-center pb-5">
			<Menu />

			<div className="container my-5 text-center custom-card">
				<h1>Página não encontrada =/</h1>

				<p>Verifique se você digitou o endereço corretamente e tente novamente.</p>
			</div>
			<FooterWave />
		</div>
	);
};
