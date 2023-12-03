import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AccordionActivities } from '../components/AccordionItemActivities';
import { CheckBoxGroupInput } from '../components/Inputs/CheckBoxGroupInput';
import { CheckBoxInput } from '../components/Inputs/CheckBoxInput';
import { DateInput } from '../components/Inputs/DateInput';
import { SelectInput } from '../components/Inputs/SelectInput';
import { TextualInput } from '../components/Inputs/TextualInput';
import { TimeInput } from '../components/Inputs/TimeInput';
import { Menu } from '../components/Menu';
import { api } from '../config/api';
import { dayOfWeekEnum } from './ManageGuardians';
// import { Button } from '../components/Button';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ButtonFinishActivity } from '../components/ButtonFinsihActivity';
import { CustomSpan } from '../components/CustomSpan';

export const ActivityStateEnum = {
	created: 'CRIADA',
	in_progress: 'EM_ANDAMENTO',
	late: 'ATRASADA',
	done: 'REALIZADA',
	not_done: 'NAO_REALIZADA',
};

const getActivities = async (dependentId) => {
	return await api()
		.get('/activity', { params: { dependentId } })
		.then((res) => {
			return res.data;
		});
};

const getDependent = async (dependentId) => {
	return await api()
		.get('/dependent/' + dependentId)
		.then((res) => {
			return res.data;
		});
};

const getGuardiansByDependentId = async (dependentId) => {
	return await api()
		.get('/guard/by-dependent-id/' + dependentId)
		.then((res) => {
			return res.data.map((guard) => ({ id: guard.guardianId, name: guard.guardianName }));
		});
};

export const DependentActivities = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [activities, setActivities] = useState([]);
	const [dependent, setDependent] = useState({});
	const [guardians, setGuardians] = useState([]);
	const [submitActivity, setSubmitActivity] = useState(false);
	const [sentForm, setSentForm] = useState({
		name: '',
		dateStart: '',
		hourStart: '',
		dateEnd: '',
		hourEnd: '',
		dependentId: id,
		currentGuardian: '-1',
		actor: '-1',
		createdBy: sessionStorage.getItem('UserId'),
		repeat: false,
		daysToRepeat: [],
		repeatUntil: '',
	});
	const [finishActivityId, setFinishActivityId] = useState(0);
	const [sentFinishForm, setSentFinishForm] = useState({
		guardianId: sessionStorage.getItem('UserId'),
		done: false,
		commentary: '',
	});
	const [trySubmitFinishForm, setTrySubmitFinishForm] = useState(false);
	const [activityErrorMessages, setActivityErrorMessages] = useState({
		name: null,
		dateStart: null,
		hourStart: null,
		dateEnd: null,
		hourEnd: null,
		dependentId: null,
		currentGuardian: null,
		actor: null,
		createdBy: null,
		daysToRepeat: null,
		repeatUntil: null,
	});
	const [showEdit, setShowEdit] = useState(false);

	const handleCloseEdit = () => setShowEdit(false);
	const handleShowEdit = () => setShowEdit(true);
	const [editActivity, setEditActivity] = useState(null);
	const editFunction = (e, activity) => {
		console.log('	cliquei');
		e.preventDefault();
		setEditActivity(activity);
		handleShowEdit();
	};
	const updateForm = (inputName, event) => {
		const { checked, value } = event.target;

		setSentForm((prevState) => {
			if (inputName == 'repeat') {
				return { ...prevState, [inputName]: checked };
			} else {
				return { ...prevState, [inputName]: value };
			}
		});
	};

	const updateFinishForm = (inputName, event) => {
		const { checked, value } = event.target;

		setSentFinishForm((prevState) => {
			if (inputName == 'done') {
				return { ...prevState, [inputName]: checked };
			} else {
				return { ...prevState, [inputName]: value };
			}
		});
	};

	useEffect(() => {
		if (sessionStorage.getItem('token') == null) {
			navigate('/login');
		}
	}, []);

	useEffect(() => {
		getDependent(id).then((dependentResult) => {
			setDependent(dependentResult);
		});
		getGuardiansByDependentId(id).then((guardiansResult) => {
			const guardiansDisjuction = guardiansResult.filter(
				(guardian, index, self) => index === self.findIndex((g) => g.id === guardian.id),
			);
			setGuardians(guardiansDisjuction);
		});
		getActivities(id).then((activities) => {
			setActivities(activities);
		});
	}, [id]);

	useEffect(() => {
		if (submitActivity) {
			const newActivity = { ...sentForm };
			const newErrorMessages = validateForm();
			if (!newActivity.repeat) {
				newActivity.daysToRepeat = [];
				newActivity.repeatUntil = null;
			}
			let isValid = true;
			Object.values(newErrorMessages).forEach((errors) => {
				if (errors !== null) {
					isValid = false;
				}
			});
			if (isValid) {
				api()
					.post('/activity', newActivity)
					.then((res) => {
						toast.success('Atividade criada com sucesso');
						handleClose();
						setActivities((oldList) => {
							const newArray = oldList;
							if (!oldList.includes(res.data)) {
								newArray.push(res.data);
							}
							return newArray;
						});
					})
					.catch((err) => {
						toast.error('Falha ao criar atividade');
						console.error(err);
					})
					.finally(() => {
						setSentForm({
							name: '',
							dateStart: '',
							hourStart: '',
							dateEnd: '',
							hourEnd: '',
							dependentId: id,
							currentGuardian: '-1',
							actor: '-1',
							createdBy: sessionStorage.getItem('UserId'),
							repeat: false,
							daysToRepeat: [],
							repeatUntil: '',
						});
						setSubmitActivity(false);
					});
			}
		}
		setSubmitActivity(false);
	}, [submitActivity]);

	const submitActivityForm = () => {
		clearValidationFields();
		setSubmitActivity(true);
	};

	const deleteActivityFunction = (e, activityId) => {
		e.preventDefault();
		api()
			.delete(`/activity/${activityId}`)
			.then(() => {
				setActivities((oldList) => oldList.filter((activity) => activity.id != activityId));
			});
	};

	useEffect(() => {
		if (trySubmitFinishForm) {
			console.log(sentFinishForm);
			api()
				.patch(`/activity/${finishActivityId}/finish`, sentFinishForm)
				.then((res) => {
					console.log(res);
					toast.success('Atividade finalizada com sucesso');
					setActivities((oldList) => {
						const indexActivity = oldList.findIndex((activity) => activity.id == finishActivityId);
						oldList[indexActivity] = res.data;
						return [...oldList];
					});
				})
				.catch((err) => {
					toast.error('Falha ao finalizar atividade');
					console.error(err);
				})
				.finally(() => {
					setTrySubmitFinishForm(false);
					setSentFinishForm({
						guardianId: sessionStorage.getItem('UserId'),
						done: false,
						commentary: '',
					});
				});
		}
	}, [trySubmitFinishForm]);

	const finishActivityFunction = (e) => {
		e.preventDefault();
		setTrySubmitFinishForm(true);
	};

	const setActivityToSendFinish = (finishActivityIdToSet) => {
		setFinishActivityId(finishActivityIdToSet);
	};

	const isEmpty = (text) => text.trim() === '';
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const validateForm = () => {
		const newErrorMessages = { ...activityErrorMessages };

		for (const [key, value] of Object.entries(sentForm)) {
			console.log('Chave', key);
			if (key != 'daysToRepeat' && key != 'repeatUntil' && key != 'repeat') {
				console.log('Chave entrou no if', key);
				if (isEmpty(value) || value == '-1') {
					newErrorMessages[key] = 'Este campo não pode ser vazio';
				}
			}
		}
		if (sentForm.repeat) {
			if (isEmpty(sentForm.repeatUntil) || sentForm.repeatUntil == '-1') {
				newErrorMessages['repeatUntil'] = 'Este campo não pode ser vazio';
			}
			if (!sentForm.daysToRepeat.length) {
				newErrorMessages['daysToRepeat'] = 'Este campo não pode ser vazio';
			}
		}
		setActivityErrorMessages(newErrorMessages);
		return newErrorMessages;
	};

	const clearValidationFields = () => {
		setActivityErrorMessages({
			name: null,
			dateStart: null,
			hourStart: null,
			dateEnd: null,
			hourEnd: null,
			dependentId: null,
			currentGuardian: null,
			actor: null,
			createdBy: null,
			daysToRepeat: null,
			repeatUntil: null,
		});
	};

	const showErrorMessages = (field) => {
		if (activityErrorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={activityErrorMessages[field]} />;
		}
	};

	return (
		<div className="app">
			<Menu />
			<div className="container">
				<div className="d-flex mt-5 pt-5">
					<Link to={'/'} className="customLink">
						Grupo Familiar{' '}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-chevron-double-right"
							viewBox="0 0 16 16"
						>
							<path
								fill-rule="evenodd"
								d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
							/>
							<path
								fill-rule="evenodd"
								d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</Link>

					<Link to={'/familygroupdetails/' + dependent.familyGroupId} className="customLink ms-1">
						Detalhes do Grupo Familiar{' '}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-chevron-double-right"
							viewBox="0 0 16 16"
						>
							<path
								fill-rule="evenodd"
								d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
							/>
							<path
								fill-rule="evenodd"
								d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</Link>
					<Link to={'/dependentactivities/' + id} className="customLink text-secondary ms-1">
						{'Atividades de ' + dependent.name}
					</Link>
				</div>
				<div className="row">
					{!!dependent && (
						<div className="my-5 d-flex flex-column flex-sm-row justify-content-between">
							<h3 className="pt-3 ">{'Atividades de ' + dependent.name}</h3>
							<Button className="custom-button" onClick={handleShow}>
								Cadastrar Nova Atividade
							</Button>
						</div>
					)}
					<>
						<div className="">
							{' '}
							<Link to={'/calendar/' + dependent.id} className="customLink">
								Ver calendário
							</Link>
						</div>
						{/* CONTAGEM DAS ATIVIDADES INICIO */}
						<div className="resumo">
							<h5 className="my-3">Resumo de Atividades</h5>
							<div className="my-2">
								<span className="badge rounded-pill bg-info">{ActivityStateEnum.created}</span>
								<span className="p fw-bold text-info"> Criadas: </span>
								<span className="text-dark">
									{activities.filter((activity) => activity.state === 'CREATED').length}
								</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-warning">{ActivityStateEnum.in_progress}</span>
								<span className="p fw-bold text-warning"> Em Andamento: </span>
								<span className="text-dark">
									{activities.filter((activity) => activity.state === 'IN_PROGRESS').length}
								</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-danger">{ActivityStateEnum.late}</span>
								<span className="p fw-bold text-danger"> Atrasadas: </span>
								<span className="text-dark">{activities.filter((activity) => activity.state === 'LATE').length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-success">{ActivityStateEnum.done}</span>
								<span className="p fw-bold text-success"> Realizadas: </span>
								<span className="text-dark">{activities.filter((activity) => activity.state === 'DONE').length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-secondary">{ActivityStateEnum.not_done}</span>
								<span className="p fw-bold text-black-50"> Não Realizadas: </span>
								<span className="text-dark">
									{activities.filter((activity) => activity.state === 'NOT_DONE').length}
								</span>
							</div>
						</div>
						{/* CONTAGEM DAS ATIVIDADES FIM */}

						{/* LISTAGEM DAS ATIVIDADES INICIO */}
						<div className="">
							{!!activities.filter((activity) => activity.state === 'IN_PROGRESS').length && (
								<>
									<h4 className="my-4 text-warning">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-alarm-clock"
										>
											<circle cx="12" cy="13" r="8" />
											<path d="M12 9v4l2 2" />
											<path d="M5 3 2 6" />
											<path d="m22 6-3-3" />
											<path d="M6.38 18.7 4 21" />
											<path d="M17.64 18.67 20 21" />
										</svg>
										<span className="ps-3 ">Em Andamento</span>
									</h4>
									<div className="accordion pb-3" id="accordionEmAndamento">
										{activities
											.filter((activity) => activity.state === 'IN_PROGRESS')
											.map((activity) => (
												<AccordionActivities
													key={activity.id}
													activity={activity}
													parent="#accordionEmAndamento"
													deleteFunction={deleteActivityFunction}
													target="#ModalFinishActivity"
													funcOnClickFinish={setActivityToSendFinish}
												/>
											))}
									</div>
								</>
							)}
							{!!activities.filter((activity) => activity.state === 'CREATED').length && (
								<>
									<h4 className="my-4 text-info">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-edit"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
										<span className="ps-3">Criadas</span>
									</h4>
									<div className="accordion pb-3" id="accordionCriadas">
										{activities
											.filter((activity) => activity.state === 'CREATED')
											.map((activity) => (
												<AccordionActivities
													key={activity.id}
													activity={activity}
													parent="#accordionCriadas"
													deleteFunction={deleteActivityFunction}
													target="#ModalFinishActivity"
													funcOnClickFinish={setActivityToSendFinish}
												/>
											))}
									</div>
								</>
							)}
							{!!activities.filter((activity) => activity.state === 'LATE').length && (
								<>
									<h4 className="my-4 text-danger">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-alarm-clock-off"
										>
											<path d="M6.87 6.87a8 8 0 1 0 11.26 11.26" />
											<path d="M19.9 14.25a8 8 0 0 0-9.15-9.15" />
											<path d="m22 6-3-3" />
											<path d="M6.26 18.67 4 21" />
											<path d="m2 2 20 20" />
											<path d="M4 4 2 6" />
										</svg>
										<span className="ps-3 ">Atrasadas</span>
									</h4>
									<div className="accordion pb-3" id="accordionAtrasadas">
										{activities
											.filter((activity) => activity.state === 'LATE')
											.map((activity) => (
												<AccordionActivities
													key={activity.id}
													activity={activity}
													parent="#accordionAtrasadas"
													deleteFunction={deleteActivityFunction}
													editFunction={(e) => editFunction(e, activity)}
													target="#ModalFinishActivity"
													funcOnClickFinish={setActivityToSendFinish}
												/>
											))}
									</div>
								</>
							)}
							{!!activities.filter((activity) => activity.state === 'DONE').length && (
								<>
									<h4 className="my-4 text-success">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-check-square"
										>
											<polyline points="9 11 12 14 22 4" />
											<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
										</svg>
										<span className="ps-3 ">Realizadas</span>
									</h4>
									<div className="accordion pb-3" id="accordionRealizadas">
										{activities
											.filter((activity) => activity.state === 'DONE')
											.map((activity) => (
												<AccordionActivities
													key={activity.id}
													activity={activity}
													parent="#accordionRealizadas"
													deleteFunction={deleteActivityFunction}
												/>
											))}
									</div>
								</>
							)}
							{!!activities.filter((activity) => activity.state === 'NOT_DONE').length && (
								<>
									<h4 className="my-4 text-black-50">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="lucide lucide-x-square"
										>
											<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
											<path d="m15 9-6 6" />
											<path d="m9 9 6 6" />
										</svg>
										<span className="ps-3 ">Não Realizadas</span>
									</h4>
									<div className="accordion pb-3" id="accordionNaoRealizadas">
										{activities
											.filter((activity) => activity.state === 'NOT_DONE')
											.map((activity) => (
												<AccordionActivities
													key={activity.id}
													activity={activity}
													parent="#accordionNaoRealizadas"
													deleteFunction={deleteActivityFunction}
												/>
											))}
									</div>
								</>
							)}
						</div>
						{/* LISTAGEM DAS ATIVIDADES FIM */}
					</>
				</div>
				{/* MODAL DE FINISH ACTIVITY INICIO */}
				{!!activities.length && (
					<div
						className="modal fade"
						id="ModalFinishActivity"
						data-bs-backdrop="static"
						data-bs-keyboard="false"
						tabIndex="-1"
						aria-labelledby="ModalFinishActivity"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h1 className="modal-title fs-5 secondary-color" id="ModalFinishActivityLabel">
										Finalizar Atividade
									</h1>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<CheckBoxInput
										label="Atividade foi realizada?"
										value={'Atividade foi realizada'}
										checked={sentFinishForm.done}
										onChange={(e) => updateFinishForm('done', e)}
									/>
									<TextualInput
										placeholder="Comentário"
										label="Comentário"
										value={sentFinishForm.commentary}
										onChange={(e) => updateFinishForm('commentary', e)}
									/>
								</div>
								<div className="modal-footer" data-bs-dismiss="modal">
									<ButtonFinishActivity type="button" text="Finalizar" onClick={(e) => finishActivityFunction(e)} />
								</div>
							</div>
						</div>
					</div>
				)}
				{/* MODAL DE FINISH ACTIVITY FIM */}
				{/* MODAL CADASTRO DE ATIVIDADE INICIO */}
				{!!dependent && !!guardians.length && (
					<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
						<Modal.Header closeButton>
							<Modal.Title>
								<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarAtividades">
									Cadastrar Nova Atividade
								</h1>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<TextualInput
								placeholder="Título da atividade"
								label="Título da Atividade"
								value={sentForm.name}
								onChange={(e) => updateForm('name', e)}
								required
							/>
							{showErrorMessages('name')}
							<DateInput
								placeholder=""
								label="Data de início"
								value={sentForm.dateStart}
								onChange={(e) => updateForm('dateStart', e)}
								required
							/>
							{showErrorMessages('dateStart')}
							<TimeInput
								placeholder=""
								label="Hora de início"
								value={sentForm.hourStart}
								onChange={(e) => updateForm('hourStart', e)}
								required
							/>
							{showErrorMessages('hourStart')}
							<DateInput
								placeholder=""
								label="Data de fim"
								value={sentForm.dateEnd}
								onChange={(e) => updateForm('dateEnd', e)}
								required
							/>
							{showErrorMessages('dateEnd')}
							<TimeInput
								placeholder=""
								label="Hora de fim"
								value={sentForm.hourEnd}
								onChange={(e) => updateForm('hourEnd', e)}
								required
							/>
							{showErrorMessages('hourEnd')}
							<SelectInput
								options={[
									{ optName: 'Escolha um responsável', optValue: '-1', disabled: true },
									...guardians.map((guardian) => {
										return { optName: guardian.name, optValue: guardian.id.toString() };
									}),
								]}
								value={sentForm.currentGuardian}
								label="Responsável atual"
								onChange={(e) => updateForm('currentGuardian', e)}
								required
							/>
							{showErrorMessages('currentGuardian')}
							<SelectInput
								options={[
									{ optName: 'Escolha um ator da atividade', optValue: '-1', disabled: true },
									...[...guardians, dependent].map((person) => ({
										optName: person.name,
										optValue: person.id.toString(),
									})),
								]}
								value={sentForm.actor}
								label="Ator da atividade"
								onChange={(e) => updateForm('actor', e)}
								required
							/>
							{showErrorMessages('actor')}
							<CheckBoxInput
								label="Repetir atividade"
								value="Deseja repetir atividade em outros dias?"
								checked={sentForm.repeat}
								onChange={(e) => updateForm('repeat', e)}
							/>
							{sentForm.repeat && (
								<>
									<CheckBoxGroupInput
										label="Dias da semana que irão repetir"
										options={dayOfWeekEnum}
										onChange={(e) => updateForm('daysToRepeat', e)}
										required
									/>
									{showErrorMessages('daysToRepeat')}
									<DateInput
										placeholder=""
										label="Repetir até"
										value={sentForm.repeatUntil}
										onChange={(e) => updateForm('repeatUntil', e)}
										required
									/>
									{showErrorMessages('repeatUntil')}
								</>
							)}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Fechar
							</Button>
							<Button className="custom-button" onClick={submitActivityForm}>
								Cadastrar
							</Button>
						</Modal.Footer>
					</Modal>
				)}
				{/* MODAL CADASTRO DE ATIVIDADE FIM */}
				<Modal show={showEdit} onHide={handleClose} backdrop="static" keyboard={false}>
					<Modal.Header closeButton>
						<Modal.Title>
							<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
								Editar Atividade
							</h1>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body></Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseEdit}>
							Fechar
						</Button>
						<Button className="custom-button">Editar</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};
