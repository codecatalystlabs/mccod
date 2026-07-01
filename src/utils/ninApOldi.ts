import originalFetch from "isomorphic-unfetch";
import fetchBuilder from "fetch-retry-ts";

const baseURL = "https://hmis-dev.health.go.ug/db-api/api/v2";
const defaultToken =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoiJDJiJDEyJEZzVFJ3dmlwWmIxdzc4VjdLUXFXTHVpMVhUUy4xRDVtVUd1Y0VsS1RvM01ldlU5NkhDM2ZXIiwidXNlciI6ImFkbWluIn0.MAr0WS4LOINOPgb5l2zdw_rWLfn8-dRlf56otvuWVMs";

let token = defaultToken;

const options = {
	retries: 3,
	retryDelay: 1000,
	retryOn: [419, 503, 504],
};

const fetch = fetchBuilder(originalFetch);
let ninTokenRequest: Promise<void> = new Promise(() => {});

export const fetchNINToken = async (engine) => {
	const getTok = async () => {
		// check exists
		const res = await engine.link.fetch("/api/dataStore");
		console.log(res);
		if (!res.includes("NINtoken")) {
			// Create the name space
			engine.link.fetch(`/api/dataStore/NINtoken/NINtoken`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: defaultToken }),
			});
			token = defaultToken;
		} else {
			const res = await engine.link.fetch(`/api/dataStore/NINtoken/NINtoken`);
			token = res.token;
		}
	}
	ninTokenRequest = getTok();
};

export const getNINPerson = async (nin) => {
	await ninTokenRequest;
	return fetch(`${baseURL}/getPerson`, {
		method: "POST",
		retries: 3,
		retryDelay: 3000,
		retryOn: [419, 503, 504],
		body: JSON.stringify({
			nationalId: nin,
			token: token,
		}),
	}).then((response) => response.json());
};

export const getNINPlaceOfBirth = async (nin) => {
	await ninTokenRequest;
	return fetch(`${baseURL}/getPlaceOfResidence`, {
		method: "POST",
		retries: 3,
		retryDelay: 3000,
		retryOn: [419, 503, 504],
		body: JSON.stringify({
			nationalId: nin,
			token: token,
		}),
	}).then((response) => response.json());
};
