import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import Token from "../contracts/GargToken.sol";
import Navbar from "./Navbar";
import Body from "./Body";

export default function App() {
	useEffect(() => {
		loadWeb3();
		loadBlockchainData();
	});

	const [account, setAccount] = useState("");
	const [token, setToken] = useState({});
	const [tokenSale, setTokenSale] = useState({});
	const [tokenBalance, setTokenBalance] = useState("0");
	const [ethBalance, setEthBalance] = useState("0");
	const [loading, setLoading] = useState(true);

	const loadBlockchainData = async () => {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		setAccount(accounts[0]);
	};

	const loadWeb3 = async () => {
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			try {
				await window.ethereum.enable();
			} catch (error) {
				console.log("Error:", error);
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}
		// Non-dapp browsers...
		else {
			window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
		}
	};

	return (
		<div>
			<Navbar />
			<Body />
		</div>
	);
}
