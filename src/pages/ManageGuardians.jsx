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

const guardianRoleEnum = [
	{ key: 'Pai', value: 'FATHER' },
	{ key: 'Mãe', value: 'MOTHER' },
	{ key: 'Parente', value: 'RELATIVE' },
	{ key: 'Provisório', value: 'TEMPORARY' },
];

const dayOfWeekEnum = [
	{ name: 'Segunda-feira', value: '1' },
	{ name: 'Terça-feira', value: '2' },
	{ name: 'Quarta-feira', value: '3' },
	{ name: 'Quinta-feira', value: '4' },
	{ name: 'Sexta-feira', value: '5' },
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

	const deleteGuard = (guardId) => {
		api.delete('/guard/' + guardId).then(() => {
			setGuards((prevState) => prevState.filter((guard) => guard.id != guardId));
		});
	};

	const updateDayOfWeek = (event, dayOfWeek) => {
		const { checked } = event.target;
		if (checked) {
			setSentForm((prevState) => {
				const newDaysOfWeek = [...prevState.daysOfWeek, dayOfWeek];
				return { ...prevState, daysOfWeek: newDaysOfWeek };
			});
		} else {
			setSentForm((prevState) => {
				const newDaysOfWeek = prevState.daysOfWeek.filter((thisDay) => thisDay != dayOfWeek);
				return { ...prevState, daysOfWeek: newDaysOfWeek };
			});
		}
	};

	useEffect(() => {
		getGuardians();

		const getGuards = (dependentId) => {
			api.get('/guard/by-dependent-id/' + dependentId).then((res) => {
				setGuards((prevGuards) => {
					console.log(`guards, looking at dependent ${dependentId}:`, [...prevGuards, ...res.data]);
					const newGuards = res.data.filter(
						(newGuard) => !prevGuards.some((prevGuard) => prevGuard.id === newGuard.id),
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
			api
				.post('/guard', newGuard)
				.then((res) => {
					console.log(res);
					setGuards((oldList) => {
						const newArray = oldList;
						newArray.push(res.data);
						return newArray;
					});
				})
				.catch((err) => console.error(err))
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
	}, [trySubmit]);

	const submitGuard = (event) => {
		event.preventDefault();
		setTrySubmit(true);
	};

	return (
		<div className="app">
			<div className="container">
				<div className="my-5 d-flex flex-row justify-content-between">
					<h3 className="pt-3 ">Gerenciar Responsáveis</h3>
					<ButtonOutlineSecondary text="Cadastrar Novo Responsável" link="/signup" />
				</div>
				<div className="row">
					<div className="d-flex flex-row justify-content-between">
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
														{!!guard.daysOfWeek.length && (
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
														<ButtonAction text="Excluir" bgColor="bg-danger" onClick={() => deleteGuard(guard.id)} />
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
									onChange={(e) => updateForm('dependentId', e)}
								/>
								<SelectInput
									options={[
										{ optName: 'Responsaveis', optValue: '-1', disabled: true },
										...guardians.map((guardian) => {
											return { optName: guardian.name, optValue: guardian.id.toString() };
										}),
									]}
									value={sentForm.guardianId}
									label="Responsável"
									onChange={(e) => updateForm('guardianId', e)}
								/>
								<SelectInput
									options={[
										{ optName: 'Escolha um papel', optValue: '-1', disabled: true },
										...guardianRoleEnum.map((role) => {
											return { optName: role.key, optValue: role.value.toString() };
										}),
									]}
									value={sentForm.guardianRole}
									label="Papel do responsável"
									onChange={(e) => updateForm('guardianRole', e)}
								/>
								<CheckBoxGroupInput
									label="Dias da semana da guarda"
									options={dayOfWeekEnum}
									onChange={updateDayOfWeek}
								/>
							</div>
							<div className="modal-footer" data-dismiss="ModalCadastrarGasto">
								<Button type="button" text="Cadastrar" onClick={submitGuard} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
