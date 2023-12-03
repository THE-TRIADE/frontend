import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ButtonOutlineSecondary } from '../components/ButtonOutlineSecondary';
import { CardFamilyGroup } from '../components/Cards/CardFamilyGroup';
import { Menu } from '../components/Menu';
import { api } from '../config/api';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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
							<label className="customLabel">Nome do grupo familiar:</label>
							<input type="text" className="inputCustom form-control mt-2 mb-2" defaultValue={editFamilyGroup.name} />
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Fechar
					</Button>
					<Button className="custom-button">Editar</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};
