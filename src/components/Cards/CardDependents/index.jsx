import PropTypes from 'prop-types';
import '../styles.css';

export const CardDependents = ({ dependent, late, created, in_progress }) => {
	return (
		<div className="col-12 col-md-4 mb-3 mb-md-0 mt-3">
			<a href="" className="text-decoration-none">
				<div className="card h-100">
					<div className="card-header text-center">
						<h5 className="text-primary fw-bold">{dependent.name}</h5>
					</div>
					<div className="card-body">
						<div className="my-2">
							<span className="badge rounded-pill bg-info">CREATED</span>
							<span className="p fw-bold text-info"> Atividades Criadas: </span>
							<span className="text-dark">{created}</span>
						</div>
						<div className="my-2">
							<span className="badge rounded-pill bg-warning">IN_PROGRESS</span>
							<span className="p fw-bold text-warning"> Atividades Em Andamento: </span>
							<span className="text-dark">{in_progress}</span>
						</div>
						<div className="my-2">
							<span className="badge rounded-pill bg-danger">LATE</span>
							<span className="p fw-bold text-danger"> Atividades Atrasadas: </span>
							<span className="text-dark">{late}</span>
						</div>
					</div>
				</div>
			</a>
		</div>
	);
};

CardDependents.propTypes = {
	dependent: PropTypes.object.isRequired,
	late: PropTypes.number.isRequired,
	created: PropTypes.number.isRequired,
	in_progress: PropTypes.number.isRequired,
};
