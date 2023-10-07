import { useState, useEffect, useRef } from 'react';
import { TextualInput } from '../components/Inputs/TextualInput';
import { TitlePages } from '../components/TitlePages';
import { DateInput } from '../components/Inputs/DateInput';
import { SelectInput } from '../components/Inputs/SelectInput';
import { CardSpents } from '../components/Cards/CardSpents';
import { api } from '../config/api';
import { Button } from '../components/Button';
import { Menu } from '../components/Menu';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Spents = () => {
	const [sentForm, setSentForm] = useState({
		name: '',
		value: '',
		paidOn: '',
		guardianId: sessionStorage.getItem('UserId'),
		dependentId: '-1',
		activityId: '',
	});
	const [spents, setSpents] = useState([]);
	const [dependents, setDependents] = useState([
		{
			dependentName: '',
			dependentId: '',
		},
	]);

	const updateForm = (inputName, event) => {
		let newValue = event.target.value;
		setSentForm((prevState) => {
			if (inputName == 'value') {
				newValue = newValue.replace(/\D/g, '');
			}
			return { ...prevState, [inputName]: newValue };
		});
	};
	const handleFormSubmit = (event) => {
		event.preventDefault();
		setSentForm({
			name: '',
			value: '',
			paidOn: '',
			guardianId: sessionStorage.getItem('UserId'),
			dependentId: '-1',
			activityId: '',
		});
	};
	const [trySubmit, setTrySubmit] = useState(false);
	const modal = useRef(null);
	useEffect(() => {
		const modalElement = document.getElementById('ModalCadastrarGasto');
		modalElement.addEventListener('hidden.bs.modal', handleFormSubmit);

		const getSpents = () => {
			api.get('/spent/by-guardian-id/' + sessionStorage.getItem('UserId')).then((res) => {
				setSpents(res.data);
			});
		};

		const getDependents = () => {
			api.get('/guardian/' + sessionStorage.getItem('UserId')).then((res) => {
				const listDependent = res.data.guards.map((guard) => {
					return {
						dependentName: guard.dependentName,
						dependentId: guard.dependentId,
					};
				});
				setDependents(listDependent);
			});
		};
		getSpents();
		getDependents();
		return () => {
			modalElement.removeEventListener('hidden.bs.modal', handleFormSubmit);
		};
	}, []);

	useEffect(() => {
		if (trySubmit) {
			const newSpent = { ...sentForm };
			api
				.post('/spent', newSpent)
				.then((res) => {
					toast.success('Gasto criado com sucesso');
					console.log(res);
					setSpents((oldList) => [...oldList, res.data]);
				})
				.catch((err) => {
					toast.error('Falha ao criar gasto');
					console.error(err);
				})
				.finally(() => {
					setTrySubmit(false);
				});
		}
	}, [trySubmit]);

	const submitSpent = () => {
		setTrySubmit(true);
	};

	const deleteSpent = (id, e) => {
		e.preventDefault();
		api
			.delete(`/spent/${id}`)
			.then(() => {
				toast.success('Gasto excluido com sucesso');
				setSpents((oldList) => oldList.filter((spent) => spent.id != id));
			})
			.catch((err) => {
				toast.error('Falha ao excluir gasto.');
				console.log(err);
			});
	};

	const valueMask = (value) => {
		const formattedValue = (Number(value) / 100).toFixed(2);
		const [intSlice, decimalSlice] = formattedValue.split('.');
		const intSliceFormatted = intSlice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		const maskedValue = `R$${intSliceFormatted},${decimalSlice}`;
		return maskedValue;
	};

	return (
		<div className="container pb-5">
			<Menu />
			<div className="row">
				<div className="col-12">
					<TitlePages text="Gastos" textButton="Cadastrar Gasto" target="#ModalCadastrarGasto" />
					<div className="row">
						<Link className="customLink my-3 text-secondary text-end fs-5" to={'/spentsreport'}>
							Ver resumo de gastos
						</Link>
						{spents.map((spent) => (
							<CardSpents key={spent.id} spent={spent} deleteSpent={deleteSpent} />
						))}
					</div>
					<div
						className="modal fade"
						id="ModalCadastrarGasto"
						data-bs-backdrop="static"
						data-bs-keyboard="false"
						tabIndex="-1"
						aria-labelledby="ModalCadastrarGasto"
						aria-hidden="true"
						ref={modal}
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGasto">
										Cadastrar Gasto
									</h1>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<TextualInput
										placeholder="Nome do gasto"
										label="Nome"
										value={sentForm.name}
										onChange={(e) => updateForm('name', e)}
									/>
									<TextualInput
										placeholder="Valor do gasto"
										label="Valor"
										value={valueMask(sentForm.value)}
										onChange={(e) => updateForm('value', e)}
									/>
									<DateInput
										placeholder=""
										label="Pago em"
										value={sentForm.paidOn}
										onChange={(e) => updateForm('paidOn', e)}
									/>
									<SelectInput
										options={[
											{ optName: 'Escolha um dependente', optValue: '-1', disabled: true },
											...dependents.map((dependent) => {
												return { optName: dependent.dependentName, optValue: dependent.dependentId.toString() };
											}),
										]}
										value={sentForm.dependentId}
										label="Dependente"
										onChange={(e) => updateForm('dependentId', e)}
									/>
								</div>
								<div className="modal-footer" data-bs-dismiss="modal">
									<Button type="button" text="Cadastrar" onClick={submitSpent} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
