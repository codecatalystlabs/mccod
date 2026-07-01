import { action, observable } from "mobx";
import { string } from "prop-types";
import { baseURL, defaultToken } from "../utils/ninApi";
import { parseJsonRes } from "../utils/parseJsonRes";

const namespace = "NIN_API";


const defaults = {
	base_url: baseURL,
	nin_token: defaultToken,
	nin_username: "",
	nin_password: "",
	nita_username: "",
	nita_password: "",
	nita_baseurl: "",
	nita_token: "",
	nita_method: "",
	sepa_username: "",
	sepa_password: "",
	sepa_token: "",
	sepa_method: ""
}

type APIDataStore = typeof defaults;

export class ApiStore {
	@observable engine: any;
	@observable ninToken: string | null = null;
	@observable values: APIDataStore | null = null;
	@observable ninTokenRequest: Promise<void> = new Promise(() => {});

	@action setEngine = (engine: any) => {
		this.engine = engine;
	};

	checkDatastoreNamespace = async () => {
		// check exists
		const res = await this.engine.link.fetch("/api/dataStore");
		if (!res.includes(namespace)) {
			// Create the name space
			await this.engine.link.fetch(`/api/dataStore/${namespace}/${namespace}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(defaults),
			});
			return false;
		}
		return true;
	};

	@action setToken = (token) => {
		this.values.nin_token = token;
		this.values.nita_token = token;
		this.values.sepa_token = token;
		this.ninToken = token;
	}

	@action fetchNINToken = async () => {
		const getTok = async () => {
			const namespaceExists = await this.checkDatastoreNamespace();
			if (!namespaceExists) {
				this.ninToken = defaultToken;
			} else {
				const res: APIDataStore = await this.engine.link.fetch(
					`/api/dataStore/${namespace}/${namespace}`
				);
				this.ninToken = res.nin_token;
			}
		};
		this.ninTokenRequest = getTok();
		await this.ninTokenRequest;
	};

	@action fetchDSValues = async () => {
		const namespaceExists = await this.checkDatastoreNamespace();
		if (!namespaceExists) {
			this.values = defaults;
		} else {
			const res = await this.engine.link.fetch(
				`/api/dataStore/${namespace}/${namespace}`
			);
			this.values = res;
		}
	}

	@action saveDSValues = async (values) => {
		this.values = values;
		await this.engine.link.fetch(`/api/dataStore/${namespace}/${namespace}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...this.values, ...values}),
		});
	}

	@action postNinToken = async (baseurl, values) => {
		const res: any = await fetch(`${baseurl}/getToken`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...values}),
		}).then((response) => parseJsonRes(response));
		if (!!res.error || !!res.data?.error) {
			throw new Error(res.error ?? res.data.error);
			return;
		}
		return res;
	}

	@action postNitaClient = async (baseurl, values) => {
		const res: any = await fetch(`${baseurl}/setNitaClient`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...values}),
		}).then((response) => parseJsonRes(response));
		if (!!res.error || !!res.data?.error)
			throw new Error(res.error ?? res.data.error);
		return res;
			
	}

	@action postSetPass = async (baseurl, values) => {
		const res: any = await fetch(`${baseurl}/setPassword`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...values}),
		}).then((response) => parseJsonRes(response));
		if (!!res.error || !!res.data?.error)
			throw new Error(res.error ?? res.data.error);
		return res;
	}
}
