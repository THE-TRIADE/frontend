import { Link, useLocation } from 'react-router-dom';
import './styles.css';

export const Menu = () => {
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path ? 'active' : '';
	};

	return (
		<nav className="navbar navbar-expand-sm fixed-top hide-print">
			<div className="container-fluid">
				<Link className="navbar-brand mx-5 text-white" to="/">
					Family Routine
				</Link>

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
							<Link className={`nav-link ${isActive('/')}`} aria-current="page" to="/">
								{/*Todo href*/}
								Início
							</Link>
						</li>
						<li className="nav-item mx-3">
							<Link className={`nav-link ${isActive('/spents')}`} to="/spents">
								{/*Todo href*/}
								Gastos
							</Link>
						</li>
						<li className="nav-item mx-3">
							<Link className={`nav-link ${isActive('/login')}`} to="/login">
								{/*Todo href*/}
								Sair
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
