import React, { useState, useEffect } from 'react';
import { TextualInput } from '../components/Inputs/TextualInput';
import { DateInput } from '../components/Inputs/DateInput';
import { SelectInput } from '../components/Inputs/SelectInput';
import { CardSpents } from '../components/Cards/CardSpents';
import { api } from '../config/api';
import { Menu } from '../components/Menu';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CustomSpan } from '../components/CustomSpan';
import { useNavigate } from 'react-router-dom';

export const Spents = () => {
	const navigate = useNavigate();
	const [sentForm, setSentForm] = useState({
		name: '',
		value: '',
		paidOn: '',
		dependentId: '-1',
	});
	0;
	const [spents, setSpents] = useState([]);
	const [dependents, setDependents] = useState([]);
	const [errorMessages, setErrorMessages] = useState({
		name: null,
		value: null,
		paidOn: null,
		dependentId: null,
	});

	const isEmpty = (text) => text.trim() === '';

	const validateForm = () => {
		const newErrorMessages = { name: null, value: null, paidOn: null, dependentId: null };
		let isValid = true;

		if (isEmpty(sentForm.name)) {
			newErrorMessages.name = 'Este campo não pode ser vazio';
			isValid = false;
		}

		if (isEmpty(sentForm.value)) {
			newErrorMessages.value = 'Este campo não pode ser vazio';
			isValid = false;
		}
		if (isEmpty(sentForm.paidOn)) {
			newErrorMessages.paidOn = 'Este campo não pode ser vazio';
			isValid = false;
		}
		if (isEmpty(sentForm.dependentId) || sentForm.dependentId === '-1') {
			newErrorMessages.dependentId = 'Por favor, selecione um dependente';
			isValid = false;
		}

		setErrorMessages(newErrorMessages);
		return isValid;
	};

	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
		clearValidationFields();
	};
	const handleShow = () => setShow(true);

	const updateForm = (inputName, event) => {
		let newValue = event.target.value;
		setSentForm((prevState) => {
			if (inputName === 'value') {
				newValue = newValue.replace(/\D/g, '');
			}
			return { ...prevState, [inputName]: newValue };
		});
	};

	const clearValidationFields = () => {
		setErrorMessages({
			name: null,
			value: null,
			paidOn: null,
			dependentId: null,
		});
	};
	const [showEdit, setShowEdit] = useState(false);

	const handleCloseEdit = () => setShowEdit(false);
	const handleShowEdit = () => setShowEdit(true);
	const [editSpent, setEditSpent] = useState(null);
	const editFunction = (e, spent) => {
		e.preventDefault();
		const updatedSpent = {
			id: spent.id,
			name: spent.name,
			value: spent.value,
			paidOn: spent.paidOn,
			dependentId: spent.dependentId,
			guardianId: spent.guardianId,
		};
		setEditSpent(updatedSpent);
		handleShowEdit();
	};
	const [trySubmit, setTrySubmit] = useState(false);

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
	const submitEdit = () => {
		const updatedSpent = editSpent;
		const spentId = updatedSpent.id;
		delete updatedSpent.id;

		api()
			.put(`/spent/${spentId}`, updatedSpent)
			.then((res) => {
				toast.success('Gasto editado com sucesso');
				handleCloseEdit();
				setSpents((oldList) => oldList.map((spent) => (spent.id === res.data.id ? res.data : spent)));
			})
			.catch((err) => {
				toast.error('Falha ao editar gasto');
				console.error(err);
			});
	};
	useEffect(() => {
		clearValidationFields();
		if (trySubmit) {
			const newSpent = { ...sentForm, guardianId: sessionStorage.getItem('UserId') };
			api()
				.post('/spent', newSpent)
				.then((res) => {
					toast.success('Gasto criado com sucesso');
					handleClose();
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
		console.log('entrou na funcao');
		if (validateForm()) {
			console.log('é valido');
			setTrySubmit(true);
		}
	};

	const deleteSpent = (id, e) => {
		e.preventDefault();
		api()
			.delete(`/spent/${id}`)
			.then(() => {
				toast.success('Gasto excluído com sucesso');
				setSpents((oldList) => oldList.filter((spent) => spent.id !== id));
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
					<div className="my-5 pt-5 d-flex flex-row flex-column flex-sm-row justify-content-between">
						<h3 className="text-primary pt-3">Gastos</h3>
						<Button className="custom-button" onClick={handleShow}>
							Cadastrar Gasto
						</Button>
					</div>
					<div className="row">
						<Link className="customLink my-3 text-secondary text-end fs-5" to={'/spentsreport'}>
							Ver resumo de gastos
						</Link>
						{spents.map((spent) => (
							<CardSpents
								key={spent.id}
								spent={spent}
								deleteSpent={deleteSpent}
								editSpent={(e) => editFunction(e, spent)}
							/>
						))}
					</div>
					<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
						<Modal.Header closeButton>
							<Modal.Title>
								<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGasto">
									Cadastrar Gasto
								</h1>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<TextualInput
								placeholder="Nome do gasto"
								label="Nome"
								value={sentForm.name}
								onChange={(e) => updateForm('name', e)}
								required
							/>
							{errorMessages.name && <CustomSpan text={errorMessages.name} />}
							<TextualInput
								placeholder="Valor do gasto"
								label="Valor"
								value={valueMask(sentForm.value)}
								onChange={(e) => updateForm('value', e)}
								required
							/>
							{errorMessages.value && <CustomSpan text={errorMessages.value} />}
							<DateInput
								placeholder=""
								label="Pago em"
								value={sentForm.paidOn}
								onChange={(e) => updateForm('paidOn', e)}
								required
							/>
							{errorMessages.paidOn && <CustomSpan text={errorMessages.paidOn} />}
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
								required
							/>
							{errorMessages.dependentId && <CustomSpan text={errorMessages.dependentId} />}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Fechar
							</Button>
							<Button className="custom-button" onClick={submitSpent}>
								Cadastrar
							</Button>
						</Modal.Footer>
					</Modal>
					<Modal show={showEdit} onHide={handleCloseEdit} backdrop="static" keyboard={false}>
						<Modal.Header closeButton>
							<Modal.Title>
								<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
									Editar Gasto
								</h1>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{editSpent && (
								<div>
									<div className="">
										<TextualInput
											placeholder="Nome do gasto"
											label="Nome"
											value={editSpent.name}
											onChange={(e) => setEditSpent({ ...editSpent, name: e.target.value })}
											required
										/>
									</div>
									<div className="">
										<TextualInput
											placeholder="Valor do gasto"
											label="Valor"
											value={valueMask(editSpent.value)}
											onChange={(e) => setEditSpent({ ...editSpent, value: e.target.value.replace(/\D/g, '') })}
											required
										/>
									</div>
									<div className="">
										<DateInput
											placeholder=""
											label="Pago em"
											value={editSpent.paidOn}
											onChange={(e) => setEditSpent({ ...editSpent, paidOn: e.target.value })}
											required
										/>
									</div>
									<div className="">
										<SelectInput
											options={[
												{ optName: 'Escolha um dependente', optValue: '-1', disabled: true },
												...dependents.map((dependent) => {
													return { optName: dependent.dependentName, optValue: dependent.dependentId.toString() };
												}),
											]}
											value={editSpent.dependentId}
											label="Dependente"
											onChange={(e) => setEditSpent({ ...editSpent, dependentId: e.target.value })}
											required
										/>
									</div>
								</div>
							)}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleCloseEdit}>
								Fechar
							</Button>
							<Button className="custom-button" onClick={submitEdit}>
								Editar
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>
		</div>
	);
};
