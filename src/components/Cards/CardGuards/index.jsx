import PropTypes from 'prop-types';
import '../styles.css';

export const CardGuards = ({ guard }) => {
	return (
		<div className="col-12 col-md-4 mb-3 mb-md-0 mt-3">
			<a href="/familygroupdetails" className="text-decoration-none">
				<div className="card h-100">
					<div className="card-header text-center">
						<h5 className="text-primary fw-bold">{guard.name}</h5>
					</div>
					<div className="card-body">
						<h5 className="card-title text-secondary">Dependentes:</h5>
					</div>
				</div>
			</a>
		</div>
	);
};

CardGuards.propTypes = {
	guard: PropTypes.object.isRequired,
};
