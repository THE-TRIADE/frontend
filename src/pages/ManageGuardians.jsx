import { Fragment, useState } from 'react';
import { api } from '../config/api';
import { useEffect } from 'react';
import { ButtonOutlineSecondary } from '../components/ButtonOutlineSecondary';

import { useParams } from 'react-router-dom';
import { ButtonAction } from '../components/ButtonAction';
import { ButtonHeader } from '../components/ButtonHeader';
import { SelectInput } from '../components/Inputs/SelectInput';
import { Button } from '../components/Button';
import { CheckBoxGroupInput } from '../components/Inputs/CheckBoxGroupInput';
import { Menu } from '../components/Menu';
import { toast } from 'react-toastify';
import { CustomSpan } from '../components/CustomSpan';

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

	const getGuardians = () => {
		api.get('/guardian').then((res) => {
			setGuardians(res.data);
		});
	};

	const deleteGuard = (dependentId, guardianId) => {
		api
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

	useEffect(() => {
		getGuardians();

		const getGuards = (dependentId) => {
			api.get('/guard/by-dependent-id/' + dependentId).then((res) => {
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
		api.get('/familyGroup/' + id).then((res) => {
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
				api
					.post('/guard', newGuard)
					.then((res) => {
						setGuards((oldList) => {
							const newArray = oldList;
							newArray.push(res.data);
							return newArray;
						});
						toast.success('Guarda criada com sucesso');
						// FIXME Feche o modal
						// document.getElementById('ModalCadastrarGuarda').modal('hide');
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
				<div className="my-5 pt-5 d-flex flex-row flex-column flex-sm-row justify-content-between">
					<h3 className="pt-3 ">Gerenciar Responsáveis</h3>
					<ButtonOutlineSecondary text="Cadastrar Novo Responsável" link="/signup" />
				</div>
				<div className="row">
					<div className="d-flex flex-row flex-column flex-sm-row justify-content-between">
						<h5 className="text-primary pt-3">Relações de Responsáveis com Dependentes</h5>
						<ButtonHeader text="Cadastrar Nova Relação" target="#ModalCadastrarGuarda" />
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
													<div className="text-end mb-2 me-2">
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
				<div
					className="modal fade"
					id="ModalCadastrarGuarda"
					data-bs-backdrop="static"
					data-bs-keyboard="false"
					tabIndex="-1"
					aria-labelledby="ModalCadastrarGuardaLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
									Cadastrar Nova Relação
								</h1>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div className="modal-body">
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
							</div>
							<div className="modal-footer">
								<Button type="button" text="Cadastrar" onClick={submitGuard} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
