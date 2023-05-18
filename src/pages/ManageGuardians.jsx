import { Fragment, useCallback, useState } from 'react';
import { api } from '../config/api';
import { useEffect } from 'react';
import { ButtonOutlineSecondary } from '../components/ButtonOutlineSecondary';

import { useParams } from 'react-router-dom';
import { ButtonAction } from '../components/ButtonAction';
import { ButtonHeader } from '../components/ButtonHeader';

export const ManageGuardians = () => {
	const { id } = useParams();
	const [familyGroup, setFamilyGroup] = useState(null);
	const [guards, setGuards] = useState([]);

	const getFamilyGroup = useCallback(() => {
		api.get('/familyGroup/' + id).then((res) => {
			setFamilyGroup(res.data);
		});
	}, [id]);

	useEffect(() => {
		getFamilyGroup();
	}, [getFamilyGroup]);

	const deleteGuard = (guardId) => {
		api.delete('/guard/' + guardId).then(() => getFamilyGroup());
	};

	useEffect(() => {
		const getGuards = (dependentId) => {
			api.get('/guard/by-dependent-id/' + dependentId).then((res) => {
				setGuards((prevGuards) => ({
					...prevGuards,
					[dependentId]: res.data,
				}));
			});
		};

		if (familyGroup) {
			familyGroup.dependents.forEach((dependent) => {
				getGuards(dependent.id);
			});
		}
	}, [familyGroup]);

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
								{guards[dependent.id] &&
									guards[dependent.id].map((guard) => (
										<div className="col-12 col-md-4 mb-3 mb-md-0 mt-3" key={guard.id}>
											<div className="card h-100">
												<div className="card-body">
													<p>
														<span className="fw-bold text-secondary">Responsável:</span> {guard.guardianName}
													</p>
													<p>
														<span className="fw-bold text-secondary">Dependente:</span> {guard.dependentName}
													</p>
													<p className="">
														Papel no grupo familiar: <span>{guard.guardianRole}</span>
													</p>
													<p className="">
														Papel no grupo familiar: <span>{guard.guardianRole}</span>
													</p>
													<p className="">
														Dias da semana: <span>{guard.daysOfWeek}</span>
													</p>
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
