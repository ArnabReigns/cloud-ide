import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3000/api/",
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject({
			data: error.response.data,
			...error,
		});
	}
);

export default api;
