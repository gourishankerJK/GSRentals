import http from "./httpServices";
import { apiUrl } from "../config.json";

export const getCategory = () => {
	return http.get(apiUrl + "category");
};
