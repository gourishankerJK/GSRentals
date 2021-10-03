import React, { Component } from "react";
import { Link } from "react-router-dom";
import ItemsTable from "./itemsTable";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";
import { getItems, deleteItem } from "../../services/itemService";
import { getCategory } from "../../services/categoryService";
import { paginate } from "../../utils/paginate";
import _ from "lodash";
import SearchBox from "../searchBox";

class Items extends Component {
	state = {
		items: [],
		category: [],
		currentPage: 1,
		pageSize: 4,
		searchQuery: "",
		selectedCategory: null,
		sortColumn: { path: "title", order: "asc" },
	};

	async componentDidMount() {
		let { data: category } = await getCategory();
		category = [{ _id: "", name: "All categories" }, ...category];
		const { data: items } = await getItems();
		this.setState({ items, category });
	}

	handleDelete = async (item) => {
		const originalitems = this.state.items;
		const items = originalitems.filter((m) => m._id !== item._id);

		try {
			this.setState({ items });
			await deleteItem(item._id);
		} catch (err) {
			console.log(err);
			this.setState({ items: originalitems });
		}
	};

	handleLike = (item) => {
		const items = [...this.state.items];
		const index = items.indexOf(item);
		items[index] = { ...items[index] };
		items[index].liked = !items[index].liked;
		this.setState({ items });
	};

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handlecategoryelect = (category) => {
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
			items: allitems,
		} = this.state;

		let filtered = allitems;
		if (searchQuery)
			filtered = allitems.filter((m) =>
				m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		else if (selectedCategory && selectedCategory._id)
			filtered = allitems.filter(
				(m) => m.category._id === selectedCategory._id
			);

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

		const items = paginate(sorted, currentPage, pageSize);

		return { totalCount: filtered.length, data: items };
	};

	render() {
		const { length: count } = this.state.items;
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		const { user } = this.props;

		if (count === 0) <p>There are no items in the database.</p>;

		const { totalCount, data: items } = this.getPagedData();

		return (
			<div className="row">
				<div className="col-3">
					<ListGroup
						items={this.state.category}
						selectedItem={this.state.selectedCategory}
						onItemSelect={this.handlecategoryelect}
					/>
				</div>
				<div className="col">
					{user && (
						<Link
							to="/items/new"
							className="btn btn-primary"
							style={{ marginBottom: 20 }}
						>
							New Item
						</Link>
					)}
					<p>Showing {totalCount} items in the database.</p>
					<SearchBox value={searchQuery} onChange={this.handleSearch} />
					<ItemsTable
						items={items}
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

export default Items;
