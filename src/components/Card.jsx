import React, { useState } from "react";

export default function Card() {
	const [token, setToken] = useState(1);

	const handleChange = (event) => {
		setToken(event.target.value);
	};

	return (
		<div className="card mr-auto ml-auto" style={{ width: "50%" }}>
			<h3 className="card-title py-1">Buy Tokens</h3>
			<span class="border border-dark"></span>
			<form className="form-group my-3 mx-3">
				<div className="input-group">
					<input className="form-control input-lg" type="number" min="1" value={token} onChange={handleChange} />
					<div className="input-group-append">
						<button type="submit" className="btn btn-primary input-group-btn">
							Buy Tokens
						</button>
					</div>
				</div>
			</form>
			{
				//TODO add dynamic tokens
			}
			<div class="progress mb-3 mx-3">
				<div
					class="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar"
					aria-valuenow="75"
					aria-valuemin="0"
					aria-valuemax="100"
					style={{ width: "50%" }}
				></div>
			</div>
			<p>
				<span>Tokens Sold</span>/<span>Tokens Available</span>
			</p>
		</div>
	);
}
