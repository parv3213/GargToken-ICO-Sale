import React, { useState } from "react";

export default function Card(props) {
	const [tokens, setTokens] = useState(1);

	const handleChange = (event) => {
		setTokens(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		await props.buyTokens(tokens);
	};

	return (
		<div className="card mr-auto ml-auto" style={{ width: "50%" }}>
			<h3 className="card-title py-1 my-3">Buy Tokens</h3>
			{/* <span className="border border-dark"></span> */}
			<form className="form-group my-3 mx-3" onSubmit={handleSubmit}>
				<div className="input-group">
					<input className="form-control input-lg" type="number" min="1" value={tokens} onChange={handleChange} />
					<div className="input-group-append">
						<button type="submit" className="btn btn-primary input-group-btn">
							Buy Tokens
						</button>
					</div>
				</div>
			</form>

			<div className="progress mb-3 mx-3">
				<div
					className="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar"
					aria-valuenow={props.tokensSold}
					aria-valuemin="0"
					aria-valuemax="750000"
					style={{ width: (props.tokensSold / 750000) * 100 + "%" }}
				></div>
			</div>
			<p>
				<span>{props.tokensSold}</span>/<span>750000</span>
			</p>
		</div>
	);
}
