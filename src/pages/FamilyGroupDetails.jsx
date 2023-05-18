import { useState } from 'react';
import { CardDependents } from '../components/Cards/CardDependents';
import { api } from '../config/api';
import { useEffect } from 'react';
import { FamilyGroupDetail } from '../components/FamilyGroupDetail';
import { useParams } from 'react-router-dom';

export const FamilyGroupDetails = () => {
	const { id } = useParams();
	const [familyGroup, setFamilyGroup] = useState(null);

	const [activitiesLate, setActivitiesLate] = useState(0);
	const [activitiesCreated, setActivitiesCreated] = useState(0);
	const [activitiesInProgress, setActivitiesInProgress] = useState(0);

	useEffect(() => {
		const getFamilyGroup = () => {
			api.get('/familyGroup/' + id).then((res) => {
				setFamilyGroup(res.data);
			});
		};
		const getActivities = (idDependent) => {
			let late = 0,
				created = 0,
				in_progress = 0;
			api.get('/activity').then((res) => {
				res.data.forEach((activity) => {
					console.log(activity);
					if (activity.dependentId === idDependent) {
						if (activity.state === 'LATE') {
							late++;
						} else if (activity.state === 'CREATED') {
							created++;
						} else if (activity.state === 'IN_PROGRESS') {
							in_progress++;
						}
					}
					setActivitiesLate(late);
					setActivitiesCreated(created);
					setActivitiesInProgress(in_progress);
				});
			});
		};
		getFamilyGroup();
		getActivities(1);
	}, []);

	return (
		<div className="app">
			<div className="container">
				<div className="row">{familyGroup && <FamilyGroupDetail familyGroup={familyGroup} />}</div>
				<div className="row">
					<h3>Dependentes</h3>
					{familyGroup &&
						familyGroup.dependents.map((dependent) => (
							<CardDependents
								key={dependent.id}
								dependent={dependent}
								late={activitiesLate}
								created={activitiesCreated}
								in_progress={activitiesInProgress}
							/>
						))}
				</div>
			</div>
		</div>
	);
};
