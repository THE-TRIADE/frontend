import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';

export default function CalendarComponent({ events }) {
	const [showModal, setShowModal] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const handleEventMouseEnter = (info) => {
		setSelectedEvent(info.event);
		setShowModal(true);
	};

	const handleClose = () => {
		setShowModal(false);
	};

	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin]}
				timeZone="America/Sao_Paulo"
				initialView="dayGridMonth"
				locale={'pt-br'}
				weekends={true}
				events={events}
				eventClick={handleEventMouseEnter}
			/>

			<Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h1 className="modal-title fs-5 secondary-color" id="ModalCadastrarGuardaLabel">
							Detalhes da Atividade
						</h1>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedEvent && (
						<>
							<p className=" fw-bold text-primary">
								Título da Atividade: <span className="text-dark fw-normal">{selectedEvent.extendedProps.name}</span>
							</p>
							<p className=" fw-bold text-primary">
								Ator: <span className="text-dark fw-normal">{selectedEvent.extendedProps.actorName}</span>
							</p>
							<p className=" fw-bold text-primary">
								Criado Por: <span className="text-dark fw-normal">{selectedEvent.extendedProps.createdByName}</span>
							</p>
							<p className=" fw-bold text-primary">
								Data de Início:{' '}
								<span className="text-dark fw-normal">
									{new Date(selectedEvent.extendedProps.dateStart).toLocaleDateString('pt-BR', {
										dateStyle: 'short',
										timeZone: 'UTC',
									})}
								</span>
							</p>
							<p className=" fw-bold text-primary">
								Data de Finalização:{' '}
								<span className="text-dark fw-normal">
									{new Date(selectedEvent.extendedProps.dateEnd).toLocaleDateString('pt-BR', {
										dateStyle: 'short',
										timeZone: 'UTC',
									})}
								</span>
							</p>
							<p className=" fw-bold text-primary">
								Horário de Inicio:{' '}
								<span className="text-dark fw-normal">
									{new Date('0-' + selectedEvent.extendedProps.hourStart).toLocaleTimeString('pt-BR', {
										timeStyle: 'short',
									})}
								</span>
							</p>
							<p className=" fw-bold text-primary">
								Horário de Finalização:{' '}
								<span className="text-dark fw-normal">
									{new Date('0-' + selectedEvent.extendedProps.hourEnd).toLocaleTimeString('pt-BR', {
										timeStyle: 'short',
									})}
								</span>
							</p>
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Fechar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
