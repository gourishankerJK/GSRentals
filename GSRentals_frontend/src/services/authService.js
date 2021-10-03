import http from "./httpServices";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";
const apiEndpoint = apiUrl + "auth";

http.setJwt(getJwt());
export async function login(email, password) {
	const { data: token } = await http.post(apiEndpoint, {
		email,
		password,
	});
	localStorage.setItem("token", token);
}
export function logout() {
	localStorage.removeItem("token");
}

function loginWithJwt(token) {
	localStorage.setItem("token", token);
}
function getJwt() {
	return localStorage.getItem("token");
}
export function getCurrentUser() {
	try {
		const token = localStorage.getItem("token");
		return jwtDecode(token);
	} catch (ex) {
		return null;
	}
}
export default {
	login,
	logout,
	getCurrentUser,
	loginWithJwt,
	getJwt,
};
