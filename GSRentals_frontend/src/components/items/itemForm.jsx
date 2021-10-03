import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getItem, saveItem } from "../../services/itemService";
import { getCategory } from "../../services/categoryService";

class ItemForm extends Form {
	state = {
		data: {
			title: "",
			categoryId: "",
			numberInStock: "",
			dailyRentalRate: "",
		},
		category: [],
		errors: {},
	};

	schema = {
		_id: Joi.string(),
		title: Joi.string().required().label("Title"),
		categoryId: Joi.string().required().label("Category"),
		numberInStock: Joi.number()
			.required()
			.min(0)
			.max(100)
			.label("Number in Stock"),
		dailyRentalRate: Joi.number()
			.required()
			.min(0)
			.max(10)
			.label("Daily Rental Rate"),
	};
	async populateCategory() {
		const { data: category } = await getCategory();
		this.setState({ category });
	}
	async populateItems() {
		try {
			const itemId = this.props.match.params.id;
			if (itemId === "new") return;
			const { data: item } = await getItem(itemId);
			this.setState({ data: this.mapToViewModel(item) });
		} catch (e) {
			if (e.response && e.response.status === 404)
				this.props.history.replace("/not-found");
		}
	}
	componentDidMount() {
		this.populateCategory();
		this.populateItems();
	}

	mapToViewModel(item) {
		console.log(item);
		return {
			_id: item._id,
			title: item.title,
			categoryId: item.category._id,
			numberInStock: item.numberInStock,
			dailyRentalRate: item.dailyRentalRate,
		};
	}

	doSubmit = async () => {
		console.log(this.state.data);
		await saveItem(this.state.data);

		this.props.history.push("/items");
	};

	render() {
		return (
			<div>
				<h1>Item Form</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderInput("title", "Title")}
					{this.renderSelect("categoryId", "Category", this.state.category)}
					{this.renderInput("numberInStock", "Number in Stock", "number")}
					{this.renderInput("dailyRentalRate", "Rate")}
					{this.renderButton("Save")}
				</form>
			</div>
		);
	}
}

export default ItemForm;
