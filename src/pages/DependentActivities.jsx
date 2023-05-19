import { useState } from 'react';
import { api } from '../config/api';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TitlePages } from '../components/TitlePages';
import { AccordionActivities } from '../components/AccordionItemActivities';

const getActivities = (dependentId) => {
	return api.get('/activity', { params: { dependentId } }).then((res) => {
		let late = [],
			created = [],
			done = [],
			notDone = [],
			inProgress = [];
		res.data.forEach((activity) => {
			if (activity.state === 'LATE') {
				late.push(activity);
			} else if (activity.state === 'CREATED') {
				created.push(activity);
			} else if (activity.state === 'IN_PROGRESS') {
				inProgress.push(activity);
			} else if (activity.state === 'DONE') {
				done.push(activity);
			} else if (activity.state === 'NOT_DONE') {
				notDone.push(activity);
			}
		});
		return { late, created, inProgress, done, notDone };
	});
};

export const DependentActivities = () => {
	const { id } = useParams();
	const [activities, setActivities] = useState(null);
	const [dependent, setDependent] = useState(null);
	const [inProgress, setInProgress] = useState([]);
	const [late, setLate] = useState([]);
	const [created, setCreated] = useState([]);
	const [done, setDone] = useState([]);
	const [notDone, setNotDone] = useState([]);

	useEffect(() => {
		const getDependent = (dependentId) => {
			return api.get('/dependent/' + dependentId).then((res) => {
				setDependent(res.data);
			});
		};
		getDependent(id);
	}, [id]);

	useEffect(() => {
		getActivities(id).then((activities) => {
			setActivities(activities);
			setInProgress(activities.inProgress);
			setLate(activities.late);
			setCreated(activities.created);
			setDone(activities.done);
			setNotDone(activities.notDone);
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
								<span className="text-dark">{activities.created.length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-warning">IN_PROGRESS</span>
								<span className="p fw-bold text-warning"> Em Andamento: </span>
								<span className="text-dark">{activities.inProgress.length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-danger">LATE</span>
								<span className="p fw-bold text-danger"> Atrasadas: </span>
								<span className="text-dark">{activities.late.length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-success">DONE</span>
								<span className="p fw-bold text-success"> Realizadas: </span>
								<span className="text-dark">{activities.done.length}</span>
							</div>
							<div className="my-2">
								<span className="badge rounded-pill bg-secondary">NOT_DONE</span>
								<span className="p fw-bold text-black-50"> Não Realizadas: </span>
								<span className="text-dark">{activities.notDone.length}</span>
							</div>
							<div className="">
								{!!inProgress.length && (
									<>
										<h4 className="my-4 text-warning">Em Andamento</h4>
										<div className="accordion pb-3" id="accordionEmAndamento">
											{inProgress.map((activity) => (
												<AccordionActivities key={activity.id} activity={activity} parent="#accordionEmAndamento" />
											))}
										</div>
									</>
								)}
								{!!created.length && (
									<>
										<h4 className="my-4 text-info">Criadas</h4>
										<div className="accordion pb-3" id="accordionCriadas">
											{created.map((activity) => (
												<AccordionActivities key={activity.id} activity={activity} parent="#accordionCriadas" />
											))}
										</div>
									</>
								)}
								{!!late.length && (
									<>
										<h4 className="my-4 text-info">Criadas</h4>
										<div className="accordion pb-3" id="accordionAtrasadas">
											{late.map((activity) => (
												<AccordionActivities key={activity.id} activity={activity} parent="#accordionAtrasadas" />
											))}
										</div>
									</>
								)}
								{!!done.length && (
									<>
										<h4 className="my-4 text-success">Realizadas</h4>
										<div className="accordion pb-3" id="accordionRealizadas">
											{done.map((activity) => (
												<AccordionActivities key={activity.id} activity={activity} parent="#accordionRealizadas" />
											))}
										</div>
									</>
								)}
								{!!notDone.length && (
									<>
										<h4 className="my-4 text-black-50">Não Realizadas</h4>
										<div className="accordion pb-3" id="accordionNaoRealizadas">
											{notDone.map((activity) => (
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
							<div className="modal-body"></div>
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
