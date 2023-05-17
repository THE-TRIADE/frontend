import { useState } from 'react';
import { CardFamilyGroup } from '../components/CardFamilyGroup';
import { FooterWave } from '../components/FooterWave';
import { TitlePages } from '../components/TitlePages';
import { api } from '../config/api';
import { useEffect } from 'react';

export const Home = () => {
	const [familyGroups, setFamilyGroups] = useState([]);

	useEffect(() => {
		const getAllFamilyGroups = () => {
			api.get('/familyGroup').then((res) => {
				setFamilyGroups(res.data);
			});
		};
		getAllFamilyGroups();
	}, []);

	return (
		<div className="app">
			<div className="container">
				<TitlePages text="Grupos Familiares" textButton="Cadastrar Grupo Familiar" target="#" />
				<div className="row">
					{familyGroups.map((familyGroup) => (
						<CardFamilyGroup key={familyGroup.id} familyGroup={familyGroup} />
					))}
				</div>
			</div>
			<FooterWave />
		</div>
	);
};
