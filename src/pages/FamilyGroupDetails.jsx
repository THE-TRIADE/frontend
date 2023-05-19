import { useState } from 'react';
import { CardDependents } from '../components/Cards/CardDependents';
import { api } from '../config/api';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu } from '../components/Menu';
import { guardianRoleEnum } from './ManageGuardians';

const getActivities = (dependentId) => {
	return api.get('/activity', { params: { dependentId } }).then((res) => {
		let late = 0,
			created = 0,
			inProgress = 0;
		res.data.forEach((activity) => {
			if (activity.state === 'LATE') {
				late++;
			} else if (activity.state === 'CREATED') {
				created++;
			} else if (activity.state === 'IN_PROGRESS') {
				inProgress++;
			}
		});
		return { late, created, inProgress };
	});
};

export const FamilyGroupDetails = () => {
	const { id } = useParams();
	const [familyGroup, setFamilyGroup] = useState(null);
	const [guards, setGuards] = useState([]);
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
		const getGuards = (dependentId) => {
			api.get('/guard/by-dependent-id/' + dependentId).then((res) => {
				setGuards((prevGuards) => ({
					...prevGuards,
					[dependentId]: res.data,
				}));
			});
		};
		if (familyGroup) {
			familyGroup.dependents.forEach((dependent) => {
				getGuards(dependent.id);
				getActivities(dependent.id).then((activity) => {
					setActivities((a) => ({ ...a, [dependent.id]: activity }));
				});
			});
		}
	}, [familyGroup]);

	return (
		<div className="app">
			<Menu />
			<div className="container">
				<div className="row">
					<h3 className="mt-5 pt-5">{familyGroup && familyGroup.name}</h3>
					<div className="d-flex flex-row justify-content-between my-2">
						<p className="fw-bold text-secondary pt-3">Responsáveis Parceiros:</p>
						<Link className="customLink fs-4" to={'/manageguardians/' + id}>
							Gerenciar Responsáveis
						</Link>
					</div>
					{familyGroup &&
						familyGroup.dependents.map((dependent) => (
							<div key={dependent.id}>
								<p className="fw-bold">Dependente: {dependent.name}</p>
								{guards[dependent.id] &&
									guards[dependent.id].map((guard) => (
										<p key={guard.id} className="my-2">
											{guard.guardianName} :{' '}
											<span>{guardianRoleEnum.find((role) => role.value == guard.guardianRole).key}</span>
											{/* <span className="text-primary mx-5">{guard.daysOfWeek}</span> */}
										</p>
									))}
							</div>
						))}
				</div>
				<div className="row">
					<p className="fw-bold text-secondary my-2">Dependentes:</p>
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
