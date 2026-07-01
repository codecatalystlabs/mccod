import requests
import json

url = "https://hmis.health.go.ug"
auth_header = "Basic aGlzcC5za3VudW5rYTpBaWNvbm5lY3RAMTIzJA=="
org_unit_id = "XiavvWaLLRz"

headers = {
    "Authorization": auth_header,
    "Accept": "application/json"
}

query_url = f"{url}/api/organisationUnits/{org_unit_id}?fields=id,displayName,path,ancestors[id,displayName,level]"
print(f"GET: {query_url}")
res = requests.get(query_url, headers=headers, timeout=15)

if res.status_code == 200:
    data = res.json()
    print("\n--- Hierarchy Path Info ---")
    print(json.dumps(data, indent=4))
else:
    print(f"Failed to fetch org unit path: {res.status_code}")
    print(res.text)
