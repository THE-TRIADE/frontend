import { Menu } from '../components/Menu';
import CalendarComponent from './CalendarComponent';
import { api } from '../config/api';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
const getActivities = async (dependentId) => {
	return await api()
		.get('/activity', { params: { dependentId } })
		.then((res) => {
			return res.data;
		});
};

export const Calendar = () => {
	const { id } = useParams();
	const [activities, setActivities] = useState([]);
	useEffect(() => {
		getActivities(id).then((activities) => {
			setActivities(activities);
		});
	}, [id]);
	const mapActivitiesToEvents = () => {
		return activities.map((activity) => ({
			title: `${activity.name} - ${activity.hourStart}`,
			start: activity.dateStart,
			end: activity.dateEnd,
			extendedProps: activity,
		}));
	};

	return (
		<div className="app justify-content-center pb-5">
			<Menu />
			<div className="container mt-5 pt-5">
				<div className="d-flex ">
					<Link to={'/dependentactivities/' + id} className="customLink ms-1">
						{'Atividades'}
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
					<Link to={'/calendar/' + id} className="customLink text-secondary ms-1">
						Calendário
					</Link>
				</div>
			</div>
			<div className="container mx-5 pt-3">
				<div className="row">
					<div className="col-12">
						<CalendarComponent events={mapActivitiesToEvents()} />
					</div>
				</div>
			</div>
		</div>
	);
};
