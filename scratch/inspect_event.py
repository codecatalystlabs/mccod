import requests
import json

server_url = "https://hmis.health.go.ug"
auth_header = "Basic aGlzcC5za3VudW5rYTpBaWNvbm5lY3RAMTIzJA=="
event_id = "LlTj5WP32EE"

url = f"{server_url}/api/events/{event_id}.json"
headers = {
    "Authorization": auth_header,
    "Accept": "application/json"
}

res = requests.get(url, headers=headers)
if res.status_code == 200:
    print(json.dumps(res.json(), indent=2))
else:
    print(f"Error {res.status_code}: {res.text}")
