import PropTypes from 'prop-types';
import './styles.css';

export const CardFamilyGroup = ({ familyGroup }) => {
	console.log(familyGroup);

	return (
		<div className="col-12 col-md-4 mb-3 mb-md-0">
			<div className="card h-100">
				<div className="card-header text-center">
					<h4 className="text-primary">{familyGroup.name}</h4>
				</div>
				<div className="card-body">
					<h5 className="card-title text-secondary">Dependentes:</h5>
					{familyGroup.dependents.map((dependent) => (
						<p className="mb-0" key={dependent.id}>
							{dependent.name}
						</p>
					))}
				</div>
			</div>
		</div>
	);
};

CardFamilyGroup.propTypes = {
	familyGroup: PropTypes.object.isRequired,
};
