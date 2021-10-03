import React from "react";
const Radio = ({ name, ...res }) => {
	return (
		<div className="form-check">
			<input
				className="form-check-input"
				type="checkbox"
				name={name}
				{...res}
				id="flexCheckDefault"
			/>
			{name}
			<label className="form-check-label" htmlFor="flexCheckDefault" />
		</div>
	);
};

export default Radio;
