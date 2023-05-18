import { useState, useEffect } from 'react';
import { TextualInput } from '../components/Inputs/TextualInput';
import { TitlePages } from '../components/TitlePages';
import { DateInput } from '../components/Inputs/DateInput';
// import { api } from '../config/api';
import { SelectInput } from '../components/Inputs/SelectInput';
import { CardSpents } from '../components/Cards/CardSpents';
import { api } from '../config/api';
import { Button } from '../components/Button';

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
		setSentForm((prevState) => {
			return { ...prevState, [inputName]: event.target.value };
		});
	};
	const handleFormSubmit = (event) => {
		event.preventDefault();
		setSentForm({
			name: '',
			value: '',
			paidOn: '',
			guardianId: '',
			dependentId: '-1',
			activityId: '',
		});
	};

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
		return () => {
			getSpents();
			getDependents();
			modalElement.removeEventListener('hidden.bs.modal', handleFormSubmit);
		};
	}, []);

	const testFunc = () => {
		console.log(sentForm);
		return;
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-12">
					<TitlePages text="Gastos" textButton="Cadastrar Gasto" target="#ModalCadastrarGasto" />
					<div className="row">
						{spents.map((spent) => (
							<CardSpents key={spent.id} spent={spent} />
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
										value={sentForm.value}
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
											{ optName: 'escolha um dependente', optValue: '-1', disabled: true },
											...dependents.map((dependent) => {
												return { optName: dependent.dependentName, optValue: dependent.dependentId.toString() };
											}),
										]}
										value={sentForm.dependentId}
										label="Dependente"
										onChange={(e) => updateForm('dependentId', e)}
									/>
								</div>
								<div className="modal-footer">
									<Button type="button" text="Cadastrar" onClick={testFunc} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
