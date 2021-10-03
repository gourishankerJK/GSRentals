import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import Like from "../common/like";
import auth from "../../services/authService";

class ItemsTable extends Component {
	constructor(props) {
		super(props);
		const user = auth.getCurrentUser();
		if (user && user.isAdmin) {
			this.columns.push(this.deleteColumn);
		}
	}
	deleteColumn = {
		key: "delete",
		content: (item) => (
			<button
				onClick={() => this.props.onDelete(item)}
				className="btn btn-danger btn-sm"
			>
				Delete
			</button>
		),
	};
	columns = [
		{
			path: "title",
			label: "Title",
			content: (item) => <Link to={`/items/${item._id}`}>{item.title}</Link>,
		},
		{ path: "category.name", label: "Category" },
		{ path: "numberInStock", label: "Stock" },
		{ path: "dailyRentalRate", label: "Rate" },
		{
			key: "like",
			content: (item) => (
				<Like liked={item.liked} onClick={() => this.props.onLike(item)} />
			),
		},
	];

	render() {
		const { items, onSort, sortColumn } = this.props;

		return (
			<Table
				columns={this.columns}
				data={items}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default ItemsTable;
