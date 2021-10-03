import http from "./httpServices";
import { apiUrl } from "../config.json";
const apiEndpoint = apiUrl + "users";
export function register(user) {
	return http.post(apiEndpoint, {
		email: user.username,
		name: user.name,
		password: user.password,
	});
}
