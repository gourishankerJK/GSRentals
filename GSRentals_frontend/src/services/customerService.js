import http from "./httpServices";

import { apiUrl } from "../config.json";
const apiEndpoint = apiUrl + "customers";

const customerUrl = (id) => {
	return `${apiEndpoint}/${id}`;
};
export const getCustomers = () => {
	return http.get(apiEndpoint);
};
export const getCustomer = (id) => {
	return http.get(customerUrl(id));
};
export const saveCustomer = (customer) => {
	if (!customer._id) return http.post(apiEndpoint + "/", customer);
	const body = { ...customer };
	delete body._id;
	return http.put(customerUrl(customer._id), body);
};
export const deleteCustomer = (id) => {
	return http.delete(customerUrl(id));
};
