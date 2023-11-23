import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DependentActivities } from './pages/DependentActivities';
import { FamilyGroup } from './pages/FamilyGroup';
import { FamilyGroupDetails } from './pages/FamilyGroupDetails';
import { ForgotPassword } from './pages/ForgotPassword';
import { Home } from './pages/Home';
import { ManageGuardians } from './pages/ManageGuardians';
import { NotFound } from './pages/NotFound';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Spents } from './pages/Spents';
import { SpentsReports } from './pages/SpentsReport';

function App() {
	return (
		<BrowserRouter basename="/frontend/">
			<Routes>
				<Route path="/familygroup" element={<FamilyGroup />} />
				<Route path="/dependentactivities/:id" element={<DependentActivities />} />
				<Route path="/familygroupdetails/:id" element={<FamilyGroupDetails />} />
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/manageguardians/:id" element={<ManageGuardians />} />
				<Route path="/spents" element={<Spents />} />
				<Route path="/spentsreport" element={<SpentsReports />} />
				<Route path="/login" element={<SignIn />} />
				<Route path="/forgotpassword" element={<ForgotPassword />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
