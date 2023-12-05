import { Fragment, useEffect, useState } from 'react';
// import { api } from '../config/api';
import { ButtonAction } from '../components/ButtonAction';
import { Menu } from '../components/Menu';
import { api } from '../config/api';
import { Link, useNavigate } from 'react-router-dom';

export const SpentsReports = () => {
	const navigate = useNavigate();
	const [spents, setSpents] = useState([]);
	const [dependents, setDependents] = useState([]);
	const printWindow = () => {
		window.print();
	};

	useEffect(() => {
		if (sessionStorage.getItem('token') == null) {
			navigate('/login');
		}
	}, []);

	useEffect(() => {
		const getSpents = () => {
			api()
				.get('/spent/by-guardian-id/' + sessionStorage.getItem('UserId'))
				.then((res) => {
					setSpents(res.data);
				});
		};

		const getDependents = () => {
			api()
				.get('/guardian/' + sessionStorage.getItem('UserId'))
				.then((res) => {
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
	}, []);

	return (
		<div className="container">
			<Menu />
			<div className="container mt-5 pt-5">
				<div className="d-flex ">
					<Link to={'/spents/'} className="customLink ms-1">
						{'Gastos'}
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
					<Link to={'/spentsreport/'} className="customLink text-secondary ms-1">
						Relatório de Gastos
					</Link>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="my-5 d-flex flex-column flex-sm-row justify-content-between">
						<h3 className="pt-3 ">Resumo de Gastos por Dependente</h3>
						<div className="hide-print">
							<ButtonAction bgColor="bg-info" text="Imprimir Resumo" onClick={printWindow} />
						</div>
					</div>
					<div className="row">
						{dependents.map((dependent) => {
							return (
								<Fragment key={dependent.id}>
									<h5 className="text-secondary pb-2">{dependent.dependentName}</h5>
									<div className="table-responsive">
										<table className="table table-striped table-light table-bordered">
											<thead>
												<tr>
													<th scope="col">Nome</th>
													<th scope="col">Valor</th>
													<th scope="col">Pago Em</th>
													<th scope="col">Responsável</th>
												</tr>
											</thead>
											<tbody>
												{spents
													.filter((spent) => dependent.dependentId === spent.dependentId)
													.map((spent) => {
														return (
															<tr key={spent.id}>
																<td>{spent.name}</td>
																<td>R$ {(spent.value / 100).toFixed(2).replace('.', ',')}</td>
																<td>
																	{new Date(spent.paidOn).toLocaleDateString('pt-BR', {
																		dateFormat: 'short',
																		timeZone: 'UTC',
																	})}
																</td>
																<td>{spent.guardianName}</td>
															</tr>
														);
													})}
											</tbody>
										</table>
									</div>
									<p className="text-end">
										Total:{' '}
										<span>
											R${' '}
											{(
												spents.reduce((acc, spent) => {
													if (dependent.dependentId === spent.dependentId) {
														return acc + spent.value;
													}
													return acc;
												}, 0) / 100
											)
												.toFixed(2)
												.replace('.', ',')}
										</span>
									</p>
								</Fragment>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
