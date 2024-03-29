import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ButtonAction } from '../../ButtonAction';
import '../styles.css';

export const CardSpents = ({ spent, deleteSpent, editSpent }) => {
	return (
		<div className="col-12 col-md-4 mb-3 mb-md-0 mt-3">
			<Link to="" className="text-decoration-none">
				<div className="card h-100">
					<div className="card-header bg-aqua text-center">
						<h5 className="fw-bold">{spent.name}</h5>
					</div>
					<div className="card-body">
						<h5 className="card-title text-secondary">Dependente:</h5>
						<p>{spent.dependentName}</p>
						<h5 className="card-title text-secondary">Valor gasto:</h5>
						<p>R$ {(spent.value / 100).toFixed(2).replace('.', ',')}</p>
						<h5 className="card-title text-secondary">Pago em:</h5>
						<p>{new Date(spent.paidOn).toLocaleDateString('pt-BR', { dateFormat: 'short', timeZone: 'UTC' })}</p>
						<h5 className="card-title text-secondary">Responsável:</h5>
						<p>{spent.guardianName}</p>
						{spent.activityId !== null && (
							<>
								<h5 className="card-title text-secondary">Atividade Relacionada:</h5>
								<p>{spent.activityName}</p>
							</>
						)}
						<div className="d-flex justify-content-end">
							<ButtonAction text="Editar" bgColor="bg-info" onClick={editSpent} />
							<ButtonAction text="Excluir" bgColor="bg-danger" onClick={(e) => deleteSpent(spent.id, e)} />
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

CardSpents.propTypes = {
	spent: PropTypes.object.isRequired,
	deleteSpent: PropTypes.func.isRequired,
	editSpent: PropTypes.func.isRequired,
};
