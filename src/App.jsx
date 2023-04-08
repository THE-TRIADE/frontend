import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { ForgotPassword } from './pages/ForgotPassword';
import { NotFound } from './pages/NotFound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/login" element={<SignIn />} />
				<Route path="/forgotpassword" element={<ForgotPassword />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
