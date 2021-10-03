import http from "./httpServices";

import { apiUrl } from "../config.json";
const apiEndpoint = apiUrl + "items";

const itemUrl = (id) => {
	return `${apiEndpoint}/${id}`;
};
export const getItems = () => {
	return http.get(apiEndpoint);
};
export const getItem = (id) => {
	return http.get(itemUrl(id));
};
export const saveItem = (item) => {
	if (!item._id) return http.post(apiEndpoint + "/", item);
	const body = { ...item };
	delete body._id;
	return http.put(itemUrl(item._id), body);
};
export const deleteItem = (id) => {
	return http.delete(itemUrl(id));
};
