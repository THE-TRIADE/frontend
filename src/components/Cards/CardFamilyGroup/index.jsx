import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ButtonAction } from '../../ButtonAction';
import '../styles.css';

export const CardFamilyGroup = ({ familyGroup, deleteFunction }) => {
	return (
		<div className="col-12 col-md-4 mb-3 mb-md-0 mt-3">
			<Link to={'/familygroupdetails/' + familyGroup.id} className="text-decoration-none">
				<div className="card h-100">
					<div className="card-header text-center">
						<h5 className="text-primary fw-bold">{familyGroup.name}</h5>
					</div>
					<div className="card-body">
						<h5 className="card-title text-secondary">Dependentes:</h5>
						{familyGroup.dependents.map((dependent) => (
							<p className="mb-0" key={dependent.id}>
								{dependent.name}
							</p>
						))}
					</div>
					<div className="text-end mb-2 me-2">
						<ButtonAction text="Excluir" bgColor="bg-danger" onClick={deleteFunction} />
					</div>
				</div>
			</Link>
		</div>
	);
};

CardFamilyGroup.propTypes = {
	familyGroup: PropTypes.object.isRequired,
	deleteFunction: PropTypes.func.isRequired,
};
