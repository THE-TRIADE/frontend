import { FooterWave } from '../components/FooterWave';

export const Home = () => {
	return (
		<div className="app justify-content-center">
			<div className="container text-center">
				<h1>
					Bem-vindo ao <span className="secondary-color">Family</span>Routine
				</h1>
				<div className="row">
					<div className="col-12"></div>
				</div>
			</div>
			<FooterWave />
		</div>
	);
};
