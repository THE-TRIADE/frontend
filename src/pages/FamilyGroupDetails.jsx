import { useState } from 'react';
import { CardDependents } from '../components/Cards/CardDependents';
import { api } from '../config/api';
import { useEffect } from 'react';
import { FamilyGroupDetail } from '../components/FamilyGroupDetail';
import { useParams } from 'react-router-dom';

const getActivities = (dependentId) => {
	return api.get('/activity', { params: { dependentId } }).then((res) => {
		let late = 0,
			created = 0,
			inProgress = 0;
		res.data.forEach((activity) => {
			console.log(activity);
			if (activity.dependentId === dependentId) {
				if (activity.state === 'LATE') {
					late++;
				} else if (activity.state === 'CREATED') {
					created++;
				} else if (activity.state === 'IN_PROGRESS') {
					inProgress++;
				}
			}
		});
		return { late, created, inProgress };
	});
};

export const FamilyGroupDetails = () => {
	const { id } = useParams();
	const [familyGroup, setFamilyGroup] = useState(null);
	const [activities, setActivities] = useState({});

	useEffect(() => {
		const getFamilyGroup = () => {
			api.get('/familyGroup/' + id).then((res) => {
				setFamilyGroup(res.data);
			});
		};
		getFamilyGroup();
	}, [id]);

	useEffect(() => {
		if (familyGroup) {
			familyGroup.dependents.forEach((dependent) => {
				getActivities(dependent.id).then((activity) => {
					setActivities((a) => ({ ...a, [dependent.id]: activity }));
				});
			});
		}
	}, [familyGroup]);

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
								late={activities[dependent.id]?.late ?? 0}
								created={activities[dependent.id]?.created ?? 0}
								in_progress={activities[dependent.id]?.inProgress ?? 0}
							/>
						))}
				</div>
			</div>
		</div>
	);
};
