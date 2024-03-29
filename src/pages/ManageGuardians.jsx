import { Fragment, useEffect, useState } from 'react';
import { ButtonOutlineSecondary } from '../components/ButtonOutlineSecondary';
import { api } from '../config/api';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ButtonAction } from '../components/ButtonAction';
import { SelectInput } from '../components/Inputs/SelectInput';
// import { Button } from '../components/Button';
import { toast } from 'react-toastify';
import { CustomSpan } from '../components/CustomSpan';
import { CheckBoxGroupInput } from '../components/Inputs/CheckBoxGroupInput';
import { Menu } from '../components/Menu';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const guardianRoleEnum = [
	{ key: 'Pai', value: 'FATHER' },
	{ key: 'Mãe', value: 'MOTHER' },
	{ key: 'Parente', value: 'RELATIVE' },
	{ key: 'Provisório', value: 'TEMPORARY' },
];

export const dayOfWeekEnum = [
	{ name: 'Segunda', value: '1' },
	{ name: 'Terça', value: '2' },
	{ name: 'Quarta', value: '3' },
	{ name: 'Quinta', value: '4' },
	{ name: 'Sexta', value: '5' },
	{ name: 'Sábado', value: '6' },
	{ name: 'Domingo', value: '7' },
];

export const ManageGuardians = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [familyGroup, setFamilyGroup] = useState({
		dependents: [],
	});
	const [guards, setGuards] = useState([]);
	const [sentForm, setSentForm] = useState({
		daysOfWeek: [],
		guardianRole: '-1',
		dependentId: '-1',
		guardianId: sessionStorage.getItem('UserId'),
	});
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [guardians, setGuardians] = useState([]);
	const [trySubmit, setTrySubmit] = useState(false);
	const [guardErrorMessages, setGuardErrorMessages] = useState({
		guardianRole: null,
		dependentId: null,
		guardianId: null,
	});

	const updateForm = (inputName, event) => {
		setSentForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};
	const [showEdit, setShowEdit] = useState(false);

	const handleCloseEdit = () => setShowEdit(false);
	const handleShowEdit = () => setShowEdit(true);
	const [editGuard, setEditGuard] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const editFunction = (e, guard) => {
		e.preventDefault();
		const updatedGuard = {
			guardianRole: guard.guardianRole,
			dependentId: guard.dependentId,
			guardianId: guard.guardianId,
		};
		setEditGuard(updatedGuard);
		handleShowEdit();
	};
	const getGuardians = () => {
		api()
			.get('/guardian')
			.then((res) => {
				setGuardians(res.data);
			});
	};

	const deleteGuard = (dependentId, guardianId) => {
		api()
			.delete('/guard', {
				params: {
					dependentId,
					guardianId,
				},
			})
			.then(() => {
				setGuards((prevState) => {
					const removedGuardIndex = prevState.findIndex(
						(guard) => guard.dependentId == dependentId && guard.guardianId == guardianId,
					);
					const newState = prevState.filter((guard, index) => index != removedGuardIndex);
					return newState;
				});
				toast.success('Guarda excluida com sucesso.');
			})
			.catch((err) => {
				toast.error('Falha ao excluir guarda.');
				console.log(err);
			});
	};

	const submitEdit = () => {
		const updatedGuard = editGuard;
		api()
			.put(`/guard/?dependentId=${updatedGuard.dependentId}&guardianId=${updatedGuard.guardianId}`, updatedGuard)
			.then((res) => {
				toast.success('Guarda editada com sucesso');
				handleCloseEdit();
				setGuards((oldList) => oldList.map((guard) => (guard.id === res.data.id ? res.data : guard)));
			})
			.catch((err) => {
				toast.error('Falha ao editar guarda');
				console.error(err);
			});
	};
	useEffect(() => {
		if (sessionStorage.getItem('token') == null) {
			navigate('/login');
		}
	}, []);

	useEffect(() => {
		getGuardians();

		const getGuards = (dependentId) => {
			api()
				.get('/guard/by-dependent-id/' + dependentId)
				.then((res) => {
					setGuards((prevGuards) => {
						const newGuards = res.data.filter(
							(newGuard) =>
								!prevGuards.some(
									(prevGuard) =>
										prevGuard.dependentId === newGuard.dependentId && prevGuard.guardianId === newGuard.guardianId,
								),
						);
						return [...prevGuards, ...newGuards];
					});
				});
		};
		api()
			.get('/familyGroup/' + id)
			.then((res) => {
				setFamilyGroup(res.data);
				setGuards([]);
				res.data.dependents.forEach((dependent) => {
					getGuards(dependent.id);
				});
			});
	}, []);

	useEffect(() => {
		if (trySubmit) {
			const newGuard = { ...sentForm };
			if (!newGuard.daysOfWeek.length) {
				newGuard.daysOfWeek = null;
			}
			const newErrorMessages = validateForm();
			let isValid = true;
			Object.values(newErrorMessages).forEach((errors) => {
				if (errors !== null) {
					isValid = false;
				}
			});
			if (isValid) {
				api()
					.post('/guard', newGuard)
					.then((res) => {
						setGuards((oldList) => {
							const newArray = oldList;
							newArray.push(res.data);
							return newArray;
						});
						toast.success('Guarda criada com sucesso');
						handleClose();
					})
					.catch((err) => {
						toast.error('Falha ao criar guarda.');
						console.error(err);
					})
					.finally(() => {
						setSentForm({
							daysOfWeek: [],
							guardianRole: '-1',
							dependentId: '-1',
							guardianId: sessionStorage.getItem('UserId'),
						});
						setTrySubmit(false);
					});
			}
		}
		setTrySubmit(false);
	}, [trySubmit]);

	useEffect(() => {
		console.log('Guards', guards);
	}, [guards]);

	const submitGuard = (event) => {
		event.preventDefault();
		clearValidationFields();
		setTrySubmit(true);
	};

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { ...guardErrorMessages };

		for (const [key, value] of Object.entries(sentForm)) {
			if (key != 'daysOfWeek') {
				if (isEmpty(value) || value == '-1') {
					newErrorMessages[key] = 'Este campo não pode ser vazio';
				}
			}
		}
		setGuardErrorMessages(newErrorMessages);
		return newErrorMessages;
	};

	const clearValidationFields = () => {
		setGuardErrorMessages({
			guardianRole: null,
			dependentId: null,
			guardianId: null,
		});
	};

	const showErrorMessages = (field) => {
		if (guardErrorMessages[field] !== null) {
			return <CustomSpan key={'error-' + field} text={guardErrorMessages[field]} />;
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
								fillRule="evenodd"
								d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
							/>
							<path
								fillRule="evenodd"
								d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</Link>

					<Link to={'/familygroupdetails/' + id} className="customLink ms-1">
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
								fillRule="evenodd"
								d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
							/>
							<path
								fillRule="evenodd"
								d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</Link>
					<Link to={'/manageguardians/' + id} className="customLink text-secondary ms-1">
						Gerenciar Responsáveis
					</Link>
				</div>
				<div className="my-5 d-flex flex-row flex-column flex-sm-row justify-content-between">
					<h3 className="pt-3 ">Gerenciar Responsáveis</h3>
					<ButtonOutlineSecondary text="Cadastrar Novo Responsável" link="/signup" />
				</div>

				<div className="row">
					<div className="d-flex flex-row flex-column flex-sm-row justify-content-between">
						<h5 className="text-primary pt-3">Relações de Responsáveis com Dependentes</h5>
						<Button className="custom-button" onClick={handleShow}>
							Cadastrar Nova Relação
						</Button>
					</div>
					{familyGroup &&
						familyGroup.dependents.map((dependent) => (
							<Fragment key={dependent.id}>
								{!!guards.length &&
									guards
										.filter((guard) => guard.dependentId == dependent.id)
										.map((guard) => (
											<div
												className="col-12 col-md-4 mb-3 mb-md-0 mt-3"
												key={`card-gd-${guard.id}-${guard.dependentId}-${guard.guardianId}`}
											>
												<div className="card h-100">
													<div className="card-body">
														<p>
															<span className="fw-bold text-secondary">Responsável:</span> {guard.guardianName}
														</p>
														<p>
															<span className="fw-bold text-secondary">Dependente:</span> {guard.dependentName}
														</p>
														<p>
															<span className="fw-bold text-secondary">Papel no grupo familiar: </span>
															{guardianRoleEnum.find((role) => role.value == guard.guardianRole).key}
														</p>
														{guard.daysOfWeek != null && !!guard.daysOfWeek.length && (
															<p>
																<span className="fw-bold text-secondary">Dias da semana: </span>
																{guard.daysOfWeek
																	.sort((a, b) => a - b)
																	.map((day, dayIndex) => {
																		if (dayIndex == guard.daysOfWeek.length - 1) {
																			return dayOfWeekEnum.find((dayOfWeek) => dayOfWeek.value == day.toString()).name;
																		}
																		return (
																			dayOfWeekEnum.find((dayOfWeek) => dayOfWeek.value == day.toString()).name + ', '
																		);
																	})}
															</p>
														)}
													</div>
													<div className="d-flex justify-content-end">
														{/* TODO Descomentar quando tiver PUT/guard */}
														{/* <ButtonAction text="Editar" bgColor="bg-info" onClick={(e) => editFunction(e, guard)} /> */}
														<ButtonAction
															text="Excluir"
															bgColor="bg-danger"
															onClick={() => deleteGuard(guard.dependentId, guard.guardianId)}
														/>
													</div>
												</div>
											</div>
										))}
							</Fragment>
						))}
				</div>
				<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
					<Modal.Header closeButton>
						<Modal.Title>
							<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
								Cadastrar Nova Relação
							</h1>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<SelectInput
							options={[
								{ optName: 'Escolha um dependente', optValue: '-1', disabled: true },
								...familyGroup.dependents.map((dependent) => {
									return { optName: dependent.name, optValue: dependent.id.toString() };
								}),
							]}
							value={sentForm.dependentId}
							label="Dependente"
							required
							onChange={(e) => updateForm('dependentId', e)}
						/>
						{showErrorMessages('dependentId')}
						<SelectInput
							options={[
								{ optName: 'Responsaveis', optValue: '-1', disabled: true },
								...guardians.map((guardian) => {
									return { optName: guardian.name, optValue: guardian.id.toString() };
								}),
							]}
							value={sentForm.guardianId}
							label="Responsável"
							required
							onChange={(e) => updateForm('guardianId', e)}
						/>
						{showErrorMessages('guardianId')}
						<SelectInput
							options={[
								{ optName: 'Escolha um papel', optValue: '-1', disabled: true },
								...guardianRoleEnum.map((role) => {
									return { optName: role.key, optValue: role.value.toString() };
								}),
							]}
							value={sentForm.guardianRole}
							label="Papel do responsável"
							required
							onChange={(e) => updateForm('guardianRole', e)}
						/>
						{showErrorMessages('guardianRole')}
						<CheckBoxGroupInput
							label="Dias da semana da guarda"
							options={dayOfWeekEnum}
							onChange={(e) => updateForm('daysOfWeek', e)}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Fechar
						</Button>
						<Button className="custom-button" onClick={submitGuard}>
							Cadastrar
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal show={showEdit} onHide={handleCloseEdit} backdrop="static" keyboard={false}>
					<Modal.Header closeButton>
						<Modal.Title>
							<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
								Editar Relação
							</h1>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{editGuard && (
							<div>
								<SelectInput
									options={[
										{ optName: 'Escolha um dependente', optValue: '-1', disabled: true },
										...familyGroup.dependents.map((dependent) => {
											return { optName: dependent.name, optValue: dependent.id.toString() };
										}),
									]}
									value={editGuard.dependentId}
									label="Dependente"
									required
									onChange={(e) => setEditGuard({ ...editGuard, dependentId: e.target.value })}
								/>
								<SelectInput
									options={[
										{ optName: 'Responsaveis', optValue: '-1', disabled: true },
										...guardians.map((guardian) => {
											return { optName: guardian.name, optValue: guardian.id.toString() };
										}),
									]}
									value={editGuard.guardianId}
									label="Responsável"
									required
									onChange={(e) => setEditGuard({ ...editGuard, guardianId: e.target.value })}
								/>
								<SelectInput
									options={[
										{ optName: 'Escolha um papel', optValue: '-1', disabled: true },
										...guardianRoleEnum.map((role) => {
											return { optName: role.key, optValue: role.value.toString() };
										}),
									]}
									value={editGuard.guardianRole}
									label="Papel do responsável"
									required
									onChange={(e) => setEditGuard({ ...editGuard, guardianRole: e.target.value })}
								/>
								<CheckBoxGroupInput
									label="Dias da semana da guarda"
									options={dayOfWeekEnum}
									onChange={(e) => setEditGuard({ ...editGuard, daysOfWeek: e.target.value })}
								/>
							</div>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseEdit}>
							Fechar
						</Button>
						<Button className="custom-button" onClick={submitEdit}>
							Editar
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};
