import axios from "axios";
export const carbonClient = axios.create({
	timeout: 15000,
	headers: { "Content-Type": "application/json" },
});
