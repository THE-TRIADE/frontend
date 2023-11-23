import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default class CalendarComponent extends React.Component {
	render() {
		const { events } = this.props;
		const handleEventMouseEnter = (info) => {
			alert(`Informações sobre a atividade: ${info.event.title}`);
		};
		return (
			<FullCalendar
				plugins={[dayGridPlugin]}
				timeZone="America/Sao_Paulo"
				initialView="dayGridMonth"
				locale={'pt-br'}
				weekends={true}
				events={events}
				eventClick={handleEventMouseEnter}
			/>
		);
	}
}
