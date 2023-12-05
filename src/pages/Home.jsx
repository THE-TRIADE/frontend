import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ButtonOutlineSecondary } from '../components/ButtonOutlineSecondary';
import { CardFamilyGroup } from '../components/Cards/CardFamilyGroup';
import { Menu } from '../components/Menu';
import { api } from '../config/api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { TextualInput } from '../components/Inputs/TextualInput';
import { SelectInput } from '../components/Inputs/SelectInput';
import { guardianRoleEnum } from './ManageGuardians';
import { DependentForm } from '../components/DependentForm';
import { ButtonOutline } from '../components/ButtonOutline';
export const Home = () => {
	const [familyGroups, setFamilyGroups] = useState([]);
	const navigate = useNavigate();
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [editFamilyGroup, setEditFamilyGroup] = useState(null);
	const editFunction = (e, familyGroup) => {
		e.preventDefault();
		setEditFamilyGroup(familyGroup);
		handleShow();
	};
	const [dependentCount, setDependentCount] = useState(1);

	const getAllFamilyGroups = useCallback(() => {
		let id = sessionStorage.getItem('UserId');
		api()
			.get('/familyGroup', {
				params: {
					guardianId: id,
				},
			})
			.then((res) => {
				setFamilyGroups(res.data);
			});
	}, []);

	useEffect(() => {
		if (sessionStorage.getItem('token') == null) {
			navigate('/login');
		}
	}, []);

	useEffect(() => {
		getAllFamilyGroups();
	}, [getAllFamilyGroups]);

	const deleteFamilyGroup = (e, id) => {
		e.preventDefault();
		api()
			.delete('/familyGroup/' + id)
			.then(() => {
				toast.success('Grupo familiar excluido com sucesso.');
				getAllFamilyGroups();
			})
			.catch((err) => {
				toast.error('Falha ao excluir grupo familiar.');
				console.log(err);
			});
	};
	const submitEdit = () => {
		api()
			.put(`/familygroup/${editFamilyGroup.id}`, editFamilyGroup)
			.then((res) => {
				toast.success('Grupo familiar editado com sucesso');
				handleClose();
				setFamilyGroups((oldList) =>
					oldList.map((familyGroup) => (familyGroup.id === editFamilyGroup.id ? res.data : familyGroup)),
				);
			})
			.catch((err) => {
				toast.error('Falha ao editar grupo familiar');
				console.error(err);
			});
	};
	return (
		<div className="app">
			<Menu />
			<div className="container">
				<div className="my-5 pt-5 d-flex flex-column flex-sm-row justify-content-between">
					<h3 className="pt-3">Grupos Familiares</h3>
					<ButtonOutlineSecondary text="Cadastrar Grupo Familiar" link="/familygroup" />
				</div>
				<div className="row">
					{familyGroups.map((familyGroup) => (
						<CardFamilyGroup
							key={familyGroup.id}
							familyGroup={familyGroup}
							deleteFunction={(e) => deleteFamilyGroup(e, familyGroup.id)}
							editFunction={(e) => editFunction(e, familyGroup)}
						/>
					))}
				</div>
			</div>
			<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
							Editar Grupo Familiar
						</h1>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{editFamilyGroup && (
						<div>
							<TextualInput
								placeholder="Nome"
								label="Nome do grupo familiar"
								value={editFamilyGroup.name}
								onChange={(e) => setEditFamilyGroup({ ...editFamilyGroup, name: e.target.value })}
								required
							/>
							<SelectInput
								options={[
									{ optName: 'Escolha um papel', optValue: '-1', disabled: true },
									...guardianRoleEnum.map((role) => {
										return { optName: role.key, optValue: role.value.toString() };
									}),
								]}
								value={editFamilyGroup.guardianRole}
								label="Papel do responsável"
								required
								onChange={(e) => setEditFamilyGroup({ ...editFamilyGroup, guardianRole: e.target.value })}
							/>
							<h5 className="text-center mt-5 text-secondary">Dependente(s)</h5>
							<div className="my-3 text-start">
								{Array.from({ length: editFamilyGroup.dependents.length }).map((_, index) => (
									<DependentForm
										key={`kdf${index}`}
										dependent={editFamilyGroup.dependents[index]}
										updateDependent={(newDependent) => {
											const updatedDependents = [...editFamilyGroup.dependents];
											updatedDependents[index] = newDependent;
											setEditFamilyGroup({ ...editFamilyGroup, dependents: updatedDependents });
										}}
									/>
								))}
								<div>
									<ButtonOutline onClick={() => setDependentCount((ps) => ps + 1)} text="Adicionar dependente +" />
								</div>
							</div>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Fechar
					</Button>
					<Button className="custom-button" onClick={submitEdit}>
						Editar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};
