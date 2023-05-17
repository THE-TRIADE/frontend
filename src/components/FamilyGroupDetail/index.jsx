import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';

export const FamilyGroupDetail = ({ familyGroup }) => {
	return (
		<div className="col-12 my-5">
			<h3 className="py-3 ">{familyGroup.name}</h3>
			<div className="d-flex flex-row justify-content-between">
				<p className="h5 fw-bold pt-3">Responsáveis Parceiros:</p>
				<Link className="customLink customSize" to="/forgotpassword">
					Gerenciar Responsáveis
				</Link>
			</div>
			<div className="row">
				<p className="my-2">
					Leonardo : <span>Pai</span>
					<span className="text-primary mx-5">SEG, QUA, SEX</span>
				</p>
				<p className="my-2">
					Lucas Vinícius : <span>Pai</span>
					<span className="text-primary mx-5">TER, QUI, SAB, DOM</span>
				</p>
			</div>
		</div>
	);
};

FamilyGroupDetail.propTypes = {
	familyGroup: PropTypes.object.isRequired,
};
