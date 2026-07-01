export function getQueryParams(): { [key: string]: string } {
    const url = window.location.href;
    const queryString = url.split('?')[1];
    if (!queryString) {
      return {};
    }
  
    const queryPairs = queryString.split('&');
    const params: { [key: string]: string } = {};
  
    queryPairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    });
    return params;
  }
  


export const nationalitiesComboOptions = [
	{
		name: "1. National",
		id: "l4UMmqvSBe5",
	},
	{
		name: "2. Foreigner",
		id: "VJU0bY182ND",
	},
	{
		name: "3. Refugee",
		id: "wUteK0Om3qP",
	},
];