import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getCustomer, saveCustomer } from "../../services/customerService";

class CustomerForm extends Form {
	state = {
		data: {
			name: "",
			isGold: "",
			phone: "",
		},
		category: [
			{ _id: 1, name: "Gold" },
			{ _id: 2, name: "Non Gold" },
		],
		errors: {},
	};

	schema = {
		_id: Joi.string(),
		name: Joi.string().required().label("name"),
		phone: Joi.string().required().label("phone"),
		isGold: Joi.boolean(),
	};
	async populateCustomers() {
		try {
			const customerId = this.props.match.params.id;
			if (customerId === "new") return;
			const { data: customer } = await getCustomer(customerId);
			this.setState({ data: this.mapToViewModel(customer) });
		} catch (e) {
			if (e.response && e.response.status === 404)
				this.props.history.replace("/not-found");
		}
	}
	componentDidMount() {
		this.populateCustomers();
	}

	mapToViewModel(customer) {
		console.log(customer);
		return {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
			isGold: customer.isGold,
		};
	}

	doSubmit = async () => {
		console.log(this.state.data);
		await saveCustomer(this.state.data);

		this.props.history.push("/customers");
	};

	render() {
		return (
			<div>
				<h1>Customer Form</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderInput("name", "Name")}
					{this.renderInput("phone", "Phone Number", "number")}
					{this.renderRadio("isGold", "isGold")}
					{this.renderButton("Save")}
				</form>
			</div>
		);
	}
}

export default CustomerForm;
