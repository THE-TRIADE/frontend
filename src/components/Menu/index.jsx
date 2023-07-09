import './styles.css';
import { useLocation } from 'react-router-dom';

export const Menu = () => {
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path ? 'active' : '';
	};

	return (
		<nav className="navbar navbar-expand-sm fixed-top hide-print">
			<div className="container-fluid">
				<a className="navbar-brand mx-5 text-white" href="#">
					Family Routine
				</a>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse mx-5" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item mx-3">
							<a className={`nav-link ${isActive('/')}`} aria-current="page" href="/">
								{/*Todo href*/}
								Início
							</a>
						</li>
						<li className="nav-item mx-3">
							<a className={`nav-link ${isActive('/spents')}`} href="/spents">
								{/*Todo href*/}
								Gastos
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
