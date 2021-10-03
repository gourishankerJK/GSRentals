import React, { Component } from "react";
import { Link } from "react-router-dom";
import CustomersTable from "./customersTable";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";
import { getCustomers, deleteCustomer } from "../../services/customerService";
import { paginate } from "../../utils/paginate";
import _ from "lodash";
import SearchBox from "../searchBox";

class Customers extends Component {
	state = {
		customers: [],
		category: [
			{ _id: 1, name: "Gold", value: true },
			{ _id: 2, name: "Non Gold", value: false },
		],
		currentPage: 1,
		pageSize: 4,
		searchQuery: "",
		selectedCategory: null,
		sortColumn: { path: "name", order: "asc" },
	};
	async componentDidMount() {
		const { data: customers } = await getCustomers();
		this.setState({ customers });
	}

	handleDelete = async (customer) => {
		const originalcustomers = this.state.customers;
		const customers = originalcustomers.filter((m) => m._id !== customer._id);

		try {
			this.setState({ customers });
			await deleteCustomer(customer._id);
		} catch (err) {
			console.log(err);
			this.setState({ customers: originalcustomers });
		}
	};

	handleLike = (customer) => {
		const customers = [...this.state.customers];
		const index = customers.indexOf(customer);
		customers[index] = { ...customers[index] };
		customers[index].liked = !customers[index].liked;
		this.setState({ customers });
	};

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handleCategorySelect = (category) => {
		console.log(category);
		this.setState({
			selectedCategory: category,
			searchQuery: "",
			currentPage: 1,
		});
	};

	handleSearch = (query) => {
		this.setState({
			searchQuery: query,
			selectedCategory: null,
			currentPage: 1,
		});
	};

	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
	};

	getPagedData = () => {
		const {
			pageSize,
			currentPage,
			sortColumn,
			selectedCategory,
			searchQuery,
			customers: allcustomers,
		} = this.state;

		let filtered = allcustomers;
		if (searchQuery)
			filtered = allcustomers.filter((m) =>
				m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		else if (selectedCategory)
			filtered = allcustomers.filter(
				(m) => m.isGold === selectedCategory.value
			);

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

		const customers = paginate(sorted, currentPage, pageSize);

		return { totalCount: filtered.length, data: customers };
	};

	render() {
		const { length: count } = this.state.customers;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		const { user } = this.props;
		console.log(user);
		if (count === 0) <p>There are no customers in the database.</p>;

		const { totalCount, data: customers } = this.getPagedData();

		return (
			<div className="row">
				<div className="col-3">
					<ListGroup
						items={this.state.category}
						selectedItem={this.state.selectedCategory}
						onItemSelect={this.handleCategorySelect}
						valueProperty="isGold"
					/>
				</div>
				<div className="col">
					{user && (
						<Link
							to="/customers/new"
							className="btn btn-primary"
							style={{ marginBottom: 20 }}
						>
							New customer
						</Link>
					)}
					<p>Showing {totalCount} customers in the database.</p>
					<SearchBox value={searchQuery} onChange={this.handleSearch} />
					<CustomersTable
						customers={customers}
						sortColumn={sortColumn}
						onLike={this.handleLike}
						onDelete={this.handleDelete}
						onSort={this.handleSort}
					/>
					<Pagination
						itemsCount={totalCount}
						pageSize={pageSize}
						currentPage={currentPage}
						onPageChange={this.handlePageChange}
					/>
				</div>
			</div>
		);
	}
}

export default Customers;
