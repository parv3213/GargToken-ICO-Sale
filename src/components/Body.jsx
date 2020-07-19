import React from "react";
import Card from "./Card";

export default function Body() {
	return (
		<div className="container text-center ">
			<p className="mb-1">Introducing GargToken Dapp!</p>
			<p className="mb-3">Token price is 0.01 Ether</p>
			<Card />
		</div>
	);
}
