import { useState } from 'react';
import { CardFamilyGroup } from '../components/Cards/CardFamilyGroup';
import { api } from '../config/api';
import { useEffect } from 'react';
import { ButtonOutlineSecondary } from '../components/ButtonOutlineSecondary';

export const Home = () => {
	const [familyGroups, setFamilyGroups] = useState([]);

	useEffect(() => {
		const getAllFamilyGroups = () => {
			api.get('/guardian/' + sessionStorage.getItem('UserId')).then((res) => {
				setFamilyGroups(res.data.familyGroups);
			});
		};
		getAllFamilyGroups();
	}, []);

	return (
		<div className="app">
			<div className="container">
				<div className="my-5 d-flex flex-row justify-content-between">
					<h3 className="pt-3">Grupos Familiares</h3>
					<ButtonOutlineSecondary text="Cadastrar Grupo Familiar" link="/familygroup" />
				</div>
				<div className="row">
					{familyGroups.map((familyGroup) => (
						<CardFamilyGroup key={familyGroup.id} familyGroup={familyGroup} />
					))}
				</div>
			</div>
		</div>
	);
};
