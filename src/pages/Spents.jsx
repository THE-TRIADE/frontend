import { useState, useEffect } from 'react';
import { TextualInput } from '../components/Inputs/TextualInput';
import { TitlePages } from '../components/TitlePages';
import { DateInput } from '../components/Inputs/DateInput';
// import { api } from '../config/api';
import { SelectInput } from '../components/Inputs/SelectInput';

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

		return () => {
			modalElement.removeEventListener('hidden.bs.modal', handleFormSubmit);
		};
	}, []);
	// const getAllDependts = () => {
	// 	let arrayOfDependents = [];
	// 	api.get('/dependent').then((res) => {
	// 		res.data.forEach((dependent) => arrayOfDependents.push(dependent));
	// 	});
	// };

	return (
		<div className="container">
			<div className="row">
				<div className="col-12">
					<TitlePages text="Gastos" textButton="Cadastrar Gasto" target="#staticBackdrop" />

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
										options={['Mãe', 'Pai', 'Parente', 'Provisório']}
										value={option}
										label="Papel no grupo familiar"
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
