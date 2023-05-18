import { useState, useEffect } from 'react';
import { TextualInput } from '../components/Inputs/TextualInput';
import { TitlePages } from '../components/TitlePages';
import { DateInput } from '../components/Inputs/DateInput';
// import { api } from '../config/api';
import { SelectInput } from '../components/Inputs/SelectInput';
import { CardSpents } from '../components/Cards/CardSpents';
import { api } from '../config/api';

export const Spents = () => {
	const [sentForm, setSentForm] = useState({
		name: '',
		value: '',
		paidOn: '',
		guardianId: '',
		dependentId: '',
		activityId: '',
	});
	const [option, setOption] = useState('A');
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
			dependentId: '',
			activityId: '',
		});
	};

	useEffect(() => {
		const modalElement = document.getElementById('staticBackdrop');
		modalElement.addEventListener('hidden.bs.modal', handleFormSubmit);
		const getSpents = () => {
			api.get('/spent/by-guardian-id/' + sessionStorage.getItem('UserId')).then((res) => {
				setSpents(res.data);
			});
		};

		const getDependents = () => {
			setDependents(() => []);
			api.get('/guardian/' + sessionStorage.getItem('UserId')).then((res) => {
				res.data.guards.map((x) => {
					setDependents((oldList) => [
						...oldList,
						{
							dependentName: x.dependentName,
							dependentId: x.dependentId,
						},
					]);
				});
			});
		};
		return () => {
			getSpents();
			getDependents();
			modalElement.removeEventListener('hidden.bs.modal', handleFormSubmit);
		};
	}, []);

	return (
		<div className="container">
			<div className="row">
				<div className="col-12">
					<TitlePages text="Gastos" textButton="Cadastrar Gasto" target="#staticBackdrop" />
					<div className="row">
						{spents.map((spent) => (
							<CardSpents key={spent.id} spent={spent} />
						))}
					</div>
					<div
						className="modal fade"
						id="staticBackdrop"
						data-bs-backdrop="static"
						data-bs-keyboard="false"
						tabIndex="-1"
						aria-labelledby="staticBackdropLabel"
						aria-hidden="true"
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h1 className="modal-title fs-5 secondary-color" id="staticBackdropLabel">
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
										options={dependents.map((x) => x.dependentName)}
										value={option}
										label="Dependente"
										onChange={(e) => setOption(e.target.value)}
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
		</div>
	);
};
