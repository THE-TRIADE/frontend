import PropTypes from 'prop-types';
import '../styles.css';
import { Link } from 'react-router-dom';

export const CardGuards = ({ guard }) => {
	return (
		<div className="col-12 col-md-4 mb-3 mb-md-0 mt-3">
			<div className="card h-100">
				<div className="card-body">
					<h5 className="">
						Responsável: <span>{guard.guardianName}</span>
					</h5>
					<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
					<Link to="#" className="btn btn-primary">
						Go somewhere
					</Link>
				</div>
			</div>
		</div>
	);
};

CardGuards.propTypes = {
	guard: PropTypes.object.isRequired,
};
