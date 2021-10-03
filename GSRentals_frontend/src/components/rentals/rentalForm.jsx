import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveRental } from "../../services/rentalService";
import { getCustomers } from "../../services/customerService";
import { getItems } from "../../services/itemService";
import _ from "lodash";

class RentalForm extends Form {
	state = {
		data: {
			customerId: "",
			itemId: "",
		},
		customers: [],
		items: [],
		errors: {},
	};

	schema = {
		_id: Joi.string(),
		customerId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.required()
			.label("Name"),
		itemId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.required()
			.label("Title"),
	};
	async populateCustomers() {
		const { data: customers } = await getCustomers();
		this.setState({ customers });
	}
	async populateItems() {
		const { data } = await getItems();
		const items = data.map((item) => {
			return {
				_id: item._id,
				name: item.title,
			};
		});
		this.setState({ items });
	}
	componentDidMount() {
		this.populateCustomers();
		this.populateItems();
	}

	doSubmit = async () => {
		await saveRental(this.state.data);
		this.props.history.push("/rentals");
	};

	render() {
		const { items, customers } = this.state;
		return (
			<div>
				<h1>Item Form</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderSelect("customerId", "Customer Name", customers)}
					{this.renderSelect("itemId", "Item", items)}
					{this.renderButton("Save")}
				</form>
			</div>
		);
	}
}

export default RentalForm;
