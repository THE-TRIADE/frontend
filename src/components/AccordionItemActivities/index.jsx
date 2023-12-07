import PropTypes from 'prop-types';
import './styles.css';
import { ButtonAction } from '../ButtonAction';
import { ButtonHeader } from '../ButtonHeader';

export const AccordionActivities = ({
	activity,
	parent,
	deleteFunction,
	target,
	funcOnClickFinish,
	editFunction = null,
}) => {
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
					{new Date(activity.dateStart).toLocaleDateString('pt-BR', { dateStyle: 'short', timeZone: 'UTC' }) +
						' - ' +
						activity.name}
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
						Data de Início:{' '}
						<span className="text-dark fw-normal">
							{new Date(activity.dateStart).toLocaleDateString('pt-BR', { dateStyle: 'short', timeZone: 'UTC' })}
						</span>
					</p>
					<p className=" fw-bold text-primary">
						Data de Finalização:{' '}
						<span className="text-dark fw-normal">
							{new Date(activity.dateEnd).toLocaleDateString('pt-BR', { dateStyle: 'short', timeZone: 'UTC' })}
						</span>
					</p>
					<p className=" fw-bold text-primary">
						Horário de Inicio:{' '}
						<span className="text-dark fw-normal">
							{new Date('0-' + activity.hourStart).toLocaleTimeString('pt-BR', { timeStyle: 'short' })}
						</span>
					</p>
					<p className=" fw-bold text-primary">
						Horário de Finalização:{' '}
						<span className="text-dark fw-normal">
							{new Date('0-' + activity.hourEnd).toLocaleTimeString('pt-BR', { timeStyle: 'short' })}
						</span>
					</p>
					{activity.commentary && (
						<p className=" fw-bold text-primary">
							Comentário: <span className="text-dark fw-normal">{activity.commentary}</span>
						</p>
					)}

					<div className="text-end">
						{editFunction != null && <ButtonAction text="Editar" bgColor="bg-info" onClick={editFunction} />}

						<ButtonAction text="Excluir" bgColor="bg-danger" onClick={(e) => deleteFunction(e, activity.id)} />
						{target != null && (
							<ButtonHeader
								text="Finalizar Atividade"
								target={target}
								bgColor="bg-success"
								funcOnClick={
									funcOnClickFinish == null
										? () => {}
										: () => {
												funcOnClickFinish(activity.id);
										  }
								}
							/>
						)}
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
	editFunction: PropTypes.func,
	target: PropTypes.string,
	funcOnClickFinish: PropTypes.func,
};
