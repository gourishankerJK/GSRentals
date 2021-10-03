import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Items from "./components/items/items";
import ItemForm from "./components/items/itemForm";
import Customers from "./components/customers/customers";
import CustomerForm from "./components/customers/customerForm";
import Logout from "./components/logout";
import Rentals from "./components/rentals/rentals";
import RentalForm from "./components/rentals/rentalForm";

import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import auth from "./services/authService";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import ProtectedRoute from "./components/common/protectedRoute";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
	state = {};

	componentDidMount() {
		const user = auth.getCurrentUser();
		this.setState({ user });
	}
	render() {
		const { user } = this.state;
		return (
			<React.Fragment>
				<ToastContainer />
				<NavBar user={user} />
				<main className="container">
					<Switch>
						<Route path="/register" component={RegisterForm} />
						<Route path="/login" component={LoginForm} />
						<Route path="/logout" component={Logout} />
						<ProtectedRoute path="/items/:id" component={ItemForm} />
						<Route
							path="/items"
							render={(props) => <Items {...props} user={user} />}
						/>
						<ProtectedRoute path="/customers/:id" component={CustomerForm} />
						<Route
							path="/customers"
							render={(props) => <Customers {...props} user={user} />}
						/>
						<ProtectedRoute path="/rentals/:id" component={RentalForm} />
						<Route
							path="/rentals"
							render={(props) => <Rentals {...props} user={user} />}
						/>
						<Route path="/not-found" component={NotFound} />
						<Redirect from="/" exact to="/items" />
						<Redirect to="/not-found" />
					</Switch>
				</main>
			</React.Fragment>
		);
	}
}

export default App;
