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
			date: activity.dateStart,
		}));
	};

	return (
		<div className="app justify-content-center pb-5">
			<Menu />
			<div className="container mt-5 pt-5">
				<Link to className="customLink" href={'/frontend/dependentactivities/' + id}>
					Voltar
				</Link>
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
