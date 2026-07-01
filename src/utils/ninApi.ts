import originalFetch from "isomorphic-unfetch";
import fetchBuilder from "fetch-retry-ts";
import { useStore } from "../Context";
import { parseJsonRes } from "./parseJsonRes";

export const baseURL = "https://hmis-dev.health.go.ug/db-api/api/v2";
export const defaultToken =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoiJDJiJDEyJEZzVFJ3dmlwWmIxdzc4VjdLUXFXTHVpMVhUUy4xRDVtVUd1Y0VsS1RvM01ldlU5NkhDM2ZXIiwidXNlciI6ImFkbWluIn0.MAr0WS4LOINOPgb5l2zdw_rWLfn8-dRlf56otvuWVMs";


const options = {
	retries: 3,
	retryDelay: 1000,
	retryOn: [419, 503, 504],
};

const fetch = fetchBuilder(originalFetch);

export const useNinApi = () => {
	const store = useStore().apiStore;

	

	return {
		getNINPerson: async (nin) => {
			return fetch(`${baseURL}/getPerson`, {
				method: "POST",
				...options,
				body: JSON.stringify({
					nationalId: nin,
					token: store.ninToken,
					method: 'getPerson'
				}),
			}).then((response) => parseJsonRes(response));
		},
		getNINPlaceOfBirth: async (nin) => {
			return fetch(`${baseURL}/getPlaceOfResidence`, {
				method: "POST",
				...options,
				body: JSON.stringify({
					nationalId: nin,
					token: store.ninToken,
					method: 'getPlaceOfResidence'
				}),
			}).then((response) => parseJsonRes(response));
		}
	}
}

