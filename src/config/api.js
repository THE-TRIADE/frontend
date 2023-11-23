import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const api = (needsToBeSigned=true) => {
	// const [navigate] = useNavigate();
	let token = sessionStorage.getItem("token");

	if(needsToBeSigned && token == null){
		// navigate("/login");
	}
	return axios.create({
		baseURL: apiUrl,
		headers: {
			Authorization: ( token == null ? "" : "Bearer " + token) 
	}})
};