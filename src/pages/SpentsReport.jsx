import { useState, useEffect } from 'react';
// import { api } from '../config/api';
import { api } from '../config/api';
import { Menu } from '../components/Menu';
import { ButtonAction } from '../components/ButtonAction';

export const SpentsReports = () => {
	const [spents, setSpents] = useState([]);
	const [dependents, setDependents] = useState([]);
	const printWindow = () => {
		window.print();
	};
	useEffect(() => {
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
	}, []);

	return (
		<div className="container">
			<Menu />
			<div className="row">
				<div className="col-12">
					<div className="my-5 pt-5 d-flex flex-row justify-content-between">
						<h3 className="pt-3 ">Resumo de Gastos por Dependente</h3>
						<ButtonAction bgColor="bg-info" text="Imprimir Resumo" onClick={printWindow} />
					</div>
					<div className="row">
						{dependents.map((dependent) => {
							return (
								<>
									<h5 className="text-secondary">{dependent.dependentName}</h5>
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
											{spents.map((spent) => {
												if (dependent.dependentId === spent.dependentId) {
													return (
														<>
															<tr>
																<td>{spent.name}</td>
																<td>{spent.value}</td>
																<td>{spent.paidOn}</td>
																<td>{spent.guardianName}</td>
															</tr>
														</>
													);
												}
											})}
										</tbody>
									</table>
									<>
										<p className="text-end">
											Total:{' '}
											<span>
												{spents.reduce((acc, spent) => {
													if (dependent.dependentId === spent.dependentId) {
														return acc + spent.value;
													}
													return acc;
												}, 0)}
											</span>
										</p>
									</>
								</>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
