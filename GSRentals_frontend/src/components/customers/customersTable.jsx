import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import Like from "../common/like";
import auth from "../../services/authService";

class CustomersTable extends Component {
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
			path: "name",
			label: "Name",
			content: (item) => <Link to={`/customers/${item._id}`}>{item.name}</Link>,
		},
		{ path: "phone", label: "Phone" },
		{
			path: "isGold",
			label: "isGold",
			content: (item) => <p>{item.isGold ? "Yes" : "No"}</p>,
		},
		{
			key: "like",
			content: (item) => (
				<Like liked={item.liked} onClick={() => this.props.onLike(item)} />
			),
		},
	];

	render() {
		const { customers, onSort, sortColumn } = this.props;

		return (
			<Table
				columns={this.columns}
				data={customers}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default CustomersTable;
