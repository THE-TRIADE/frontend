import './styles.css';
import { useLocation } from 'react-router-dom';

export const Menu = () => {
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path ? 'active' : '';
	};

	return (
		<nav className="navbar navbar-expand-sm bg-light fixed-top">
			<div className="container-fluid">
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
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item">
							<a className={`nav-link ${isActive('/Home')}`} aria-current="page" href="/Home">
								{/*Todo href*/}
								Início
							</a>
						</li>
						<li className="nav-item">
							<a className={`nav-link ${isActive('/Activities')}`} aria-current="page" href="/Activities">
								{/*Todo href*/}
								Atividades
							</a>
						</li>
						<li className="nav-item">
							<a className={`nav-link ${isActive('/signup')}`} href="/signup">
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
