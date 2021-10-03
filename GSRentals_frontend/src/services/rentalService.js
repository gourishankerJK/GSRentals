import http from "./httpServices";

import { apiUrl } from "../config.json";
const apiEndpoint = apiUrl + "rentals";

const rentalUrl = (id) => {
	return `${apiEndpoint}/${id}`;
};
export const getRentals = () => {
	return http.get(apiEndpoint);
};
export const getRental = (id) => {
	return http.get(rentalUrl(id));
};
export const saveRental = (item) => {
	if (!item._id) return http.post(apiEndpoint + "/", item);
	const body = { ...item };
	delete body._id;
	return http.put(rentalUrl(item._id), body);
};
export const returnRental = (rental) => {
	return http.post(apiUrl + "returns", rental);
};
