import React, { Component } from "react";
import Table from "../common/table";
import auth from "../../services/authService";

class RentalTable extends Component {
	constructor(props) {
		super(props);
		const user = auth.getCurrentUser();

		if (user && user.isAdmin) {
			this.columns.push(this.returnColumn);
		}
	}
	returnColumn = {
		key: "delete",
		content: (item) =>
			!item.dateReturned && (
				<button
					onClick={() => this.props.onReturn(item)}
					className="btn btn-danger btn-sm"
				>
					Return
				</button>
			),
	};
	columns = [
		{
			path: "customer.name",
			label: "Title",
		},
		{ path: "customer.phone", label: "Phone" },
		{ path: "item.title", label: "Item" },

		{
			path: "rentalFee",
			label: "Rental Fee",
		},
		{
			path: "item.dailyRentalRate",
			label: "Daily Rental Rate",
		},

		{
			key: "DateOut",
			label: "DateOut",
			content: (item) => {
				const date = new Date(item.dateOut);
				return <p>{date.toLocaleDateString()}</p>;
			},
		},
		{
			key: "Return Date",
			label: "Return Date",
			content: (item) => {
				const date = new Date(item.dateOut);
				return <p>{date.toLocaleDateString()}</p>;
			},
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

export default RentalTable;
