import PropTypes from 'prop-types';
import './styles.css';
import { ButtonHeader } from '../ButtonHeader';
import { ButtonAction } from '../ButtonAction';

export const AccordionActivities = ({ activity, parent, deleteFunction }) => {
	return (
		<div className="accordion-item">
			<h2 className="accordion-header" id={'heading' + activity.id}>
				<button
					className="accordion-button collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target={'#collapse' + activity.id}
					aria-expanded="false"
					aria-controls={'collapse' + activity.id}
				>
					{activity.name}
				</button>
			</h2>
			<div
				id={'collapse' + activity.id}
				className="accordion-collapse collapse"
				aria-labelledby={'heading' + activity.id}
				data-bs-parent={parent}
			>
				<div className="accordion-body">
					<p className=" fw-bold text-primary">
						Ator: <span className="text-dark fw-normal">{activity.actorName}</span>
					</p>
					<p className=" fw-bold text-primary">
						Criado Por: <span className="text-dark fw-normal">{activity.createdByName}</span>
					</p>
					<p className=" fw-bold text-primary">
						Data de Início: <span className="text-dark fw-normal">{activity.dateStart}</span>
					</p>
					<p className=" fw-bold text-primary">
						Data de Finalização: <span className="text-dark fw-normal">{activity.dateEnd}</span>
					</p>
					<p className=" fw-bold text-primary">
						Horário de Inicio: <span className="text-dark fw-normal">{activity.hourStart}</span>
					</p>
					<p className=" fw-bold text-primary">
						Horário de Finalização: <span className="text-dark fw-normal">{activity.hourEnd}</span>
					</p>
					{activity.commentary && (
						<p className=" fw-bold text-primary">
							Comentário: <span className="text-dark fw-normal">{activity.hourEnd}</span>
						</p>
					)}
					<div className="text-end">
						<ButtonAction text="Excluir" bgColor="bg-danger" onClick={deleteFunction} />
						<ButtonHeader text="Finalizar Atividade" target="#ModalFinalizarAtividade" />
					</div>
				</div>
			</div>
			<div
				className="modal fade"
				id="ModalFinalizarAtividade"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby="ModalFinalizarAtividadeLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5 secondary-color" id="ModalFinalizarAtividadeLabel">
								Finalizar Atividade
							</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body"></div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary">
								Finalizar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

AccordionActivities.propTypes = {
	activity: PropTypes.object.isRequired,
	parent: PropTypes.string.isRequired,
	deleteFunction: PropTypes.func.isRequired,
};
