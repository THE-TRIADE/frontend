import { useState } from 'react';
import { api } from '../config/api';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TitlePages } from '../components/TitlePages';
import { AccordionActivities } from '../components/AccordionItemActivities';
import { TextualInput } from '../components/Inputs/TextualInput';
import { DateInput } from '../components/Inputs/DateInput';
import { TimeInput } from '../components/Inputs/TimeInput';
import { SelectInput } from '../components/Inputs/SelectInput';

const getActivities = (dependentId) => {
	return api.get('/activity', { params: { dependentId } }).then((res) => {
		return res.data;
	});
};

const getDependent = (dependentId) => {
	return api.get('/dependent/' + dependentId).then((res) => {
		return res.data;
	});
};

const getGuardiansByDependentId = (dependentId) => {
	return api.get('/guard/by-dependent-id/' + dependentId).then((res) => {
		return res.data.map((guard) => ({ guardianId: guard.guardianId, guardianName: guard.guardianName }));
	});
};

export const DependentActivities = () => {
	const { id } = useParams();
	const [activities, setActivities] = useState([]);
	const [dependent, setDependent] = useState({});
	const [guardians, setGuardians] = useState([]);
	const [sentForm, setSentForm] = useState({
		name: '',
		dateStart: '',
		hourStart: '',
		dateEnd: '',
		hourEnd: '',
		dependentId: id,
		currentGuardian: '',
		actor: '',
		createdBy: sessionStorage.getItem('UserId'),
		repeat: false,
		daysToRepeat: [],
		repeatUntil: '',
	});

	const updateForm = (inputName, event) => {
		setSentForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};

	useEffect(() => {
		getDependent(id).then((dependentResult) => {
			setDependent(dependentResult);
		});
		getGuardiansByDependentId(id).then((guardiansResult) => {
			setGuardians(guardiansResult);
		});
		getActivities(id).then((activities) => {
			setActivities(activities);
		});
	}, [id]);

	return (
		<div className="app">
			<div className="container">
				<div className="row">
					{dependent && (
						<TitlePages
							text={'Atividades de ' + dependent.name}
							textButton="Cadastrar Atividade"
							target="#ModalCadastrarAtividades"
						/>
					)}
					{activities && (
						<div className="resumo">
							<h5 className="my-3">Resumo de Atividades</h5>
							<div className="my-2">
								<span className="badge rounded-pill bg-info">CREATED</span>
								<span className="p fw-bold text-info"> Criadas: </span>
								<span className="text-dark">
									{activities.filter((activity) => activity.status === 'CREATED').length}
								</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-warning">IN_PROGRESS</span>
								<span className="p fw-bold text-warning"> Em Andamento: </span>
								<span className="text-dark">
									{activities.filter((activity) => activity.status === 'IN_PROGRESS').length}
								</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-danger">LATE</span>
								<span className="p fw-bold text-danger"> Atrasadas: </span>
								<span className="text-dark">{activities.filter((activity) => activity.status === 'LATE').length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-success">DONE</span>
								<span className="p fw-bold text-success"> Realizadas: </span>
								<span className="text-dark">{activities.filter((activity) => activity.status === 'DONE').length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-secondary">NOT_DONE</span>
								<span className="p fw-bold text-black-50"> Não Realizadas: </span>
								<span className="text-dark">
									{activities.filter((activity) => activity.status === 'NOT_DONE').length}
								</span>
							</div>
							<div className="">
								{!!activities.filter((activity) => activity.status === 'IN_PROGRESS').length && (
									<>
										<h4 className="my-4 text-warning">Em Andamento</h4>
										<div className="accordion pb-3" id="accordionEmAndamento">
											{activities
												.filter((activity) => activity.status === 'IN_PROGRESS')
												.map((activity) => (
													<AccordionActivities key={activity.id} activity={activity} parent="#accordionEmAndamento" />
												))}
										</div>
									</>
								)}
								{!!activities.filter((activity) => activity.status === 'CREATED').length && (
									<>
										<h4 className="my-4 text-info">Criadas</h4>
										<div className="accordion pb-3" id="accordionCriadas">
											{activities
												.filter((activity) => activity.status === 'CREATED')
												.map((activity) => (
													<AccordionActivities key={activity.id} activity={activity} parent="#accordionCriadas" />
												))}
										</div>
									</>
								)}
								{!!activities.filter((activity) => activity.status === 'LATE').length && (
									<>
										<h4 className="my-4 text-info">Criadas</h4>
										<div className="accordion pb-3" id="accordionAtrasadas">
											{activities
												.filter((activity) => activity.status === 'LATE')
												.map((activity) => (
													<AccordionActivities key={activity.id} activity={activity} parent="#accordionAtrasadas" />
												))}
										</div>
									</>
								)}
								{!!activities.filter((activity) => activity.status === 'DONE').length && (
									<>
										<h4 className="my-4 text-success">Realizadas</h4>
										<div className="accordion pb-3" id="accordionRealizadas">
											{activities
												.filter((activity) => activity.status === 'DONE')
												.map((activity) => (
													<AccordionActivities key={activity.id} activity={activity} parent="#accordionRealizadas" />
												))}
										</div>
									</>
								)}
								{!!activities.filter((activity) => activity.status === 'NOT_DONE').length && (
									<>
										<h4 className="my-4 text-black-50">Não Realizadas</h4>
										<div className="accordion pb-3" id="accordionNaoRealizadas">
											{activities
												.filter((activity) => activity.status === 'NOT_DONE')
												.map((activity) => (
													<AccordionActivities key={activity.id} activity={activity} parent="#accordionNaoRealizadas" />
												))}
										</div>
									</>
								)}
							</div>
						</div>
					)}
				</div>
				<div
					className="modal fade"
					id="ModalCadastrarAtividades"
					data-bs-backdrop="static"
					data-bs-keyboard="false"
					tabIndex="-1"
					aria-labelledby="ModalCadastrarAtividadesLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarAtividadesLabel">
									Cadastrar Nova Atividade
								</h1>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div className="modal-body">
								<TextualInput
									placeholder="Título da atividade"
									label="Título da Atividade"
									value={sentForm.name}
									onChange={(e) => updateForm('name', e)}
								/>
								<DateInput
									placeholder=""
									label="Data de início"
									value={sentForm.dateStart}
									onChange={(e) => updateForm('dateStart', e)}
								/>
								<TimeInput
									placeholder=""
									label="Hora de início"
									value={sentForm.hourStart}
									onChange={(e) => updateForm('dateStart', e)}
								/>
								<DateInput
									placeholder=""
									label="Data de fim"
									value={sentForm.dateEnd}
									onChange={(e) => updateForm('dateEnd', e)}
								/>
								<TimeInput
									placeholder=""
									label="Hora de fim"
									value={sentForm.hourStart}
									onChange={(e) => updateForm('dateStart', e)}
								/>
								<SelectInput
									options={[
										{ optName: 'Escolha um responsável', optValue: '-1', disabled: true },
										...guardians.map((guardian) => {
											return { optName: guardian.guardianName, optValue: guardian.guardianId.toString() };
										}),
									]}
									value={sentForm.dependentId}
									label="Responsável atual"
									onChange={(e) => updateForm('currentGuardian', e)}
								/>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary">
									Cadastrar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
