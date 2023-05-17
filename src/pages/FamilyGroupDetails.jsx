import { useState } from 'react';
import { CardDependents } from '../components/Cards/CardDependents';
import { api } from '../config/api';
import { useEffect } from 'react';
import { FamilyGroupDetail } from '../components/FamilyGroupDetail';

export const FamilyGroupDetails = () => {
	const [familyGroup, setFamilyGroup] = useState([]);
	const [familyGroupDependents, setfamilyGroupDependents] = useState([]);
	const [activitiesLate, setActivitiesLate] = useState(0);
	const [activitiesCreated, setActivitiesCreated] = useState(0);
	const [activitiesInProgress, setActivitiesInProgress] = useState(0);

	useEffect(() => {
		const getFamilyGroup = () => {
			api.get('/familyGroup').then((res) => {
				setFamilyGroup(res.data[1]);
				setfamilyGroupDependents(res.data[1].dependents);
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
						console.log('é igual');
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
					{familyGroupDependents.map((dependent) => (
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
