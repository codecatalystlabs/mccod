import json

input_file = "c:\\Users\\SK\\Documents\\Paul Mbaka hmis 100\\health-app\\scratch\\buwenge_events_summary.json"

with open(input_file, "r") as f:
    events = json.load(f)

event_ids = ["uvH8SXo45oA", "dD6QC7uSAS1", "zc5WHTwfaBO"]

print("--- Event Status & Completion Details ---")
for ev in events:
    if ev.get("event_id") in event_ids:
        # Load all data values from the raw event object
        raw_event = ev.get("all_data_values")
        # In DHIS2 events response, status is a top-level field
        # Since we dumped the whole event in dump_buwenge_events.py, let's search it
        print(f"\nEvent ID: {ev.get('event_id')}")
        print(f"  Inpatient Number: {ev.get('inpatient_num')}")
        print(f"  Event Date: {ev.get('event_date')}")
        
        # We need to read the full events JSON to get top-level fields like status, programStatus, etc.
        # Let's search the original full events file
        pass

# Let's read the full events from the raw query response or check the raw events
raw_file = "c:\\Users\\SK\\Documents\\Paul Mbaka hmis 100\\health-app\\scratch\\buwenge_events_summary.json"
# Actually, the buwenge_events_summary.json contains the summary, but let's see if we can query the server directly for just these three event details.
import requests
url = "https://hmis.health.go.ug"
auth_header = "Basic aGlzcC5za3VudW5rYTpBaWNvbm5lY3RAMTIzJA=="
headers = {
    "Authorization": auth_header,
    "Accept": "application/json"
}

for eid in event_ids:
    res = requests.get(f"{url}/api/events/{eid}", headers=headers)
    if res.status_code == 200:
        data = res.json()
        print(f"\nEvent: {eid}")
        print(f"  Status: {data.get('status')}")
        print(f"  Program Status: {data.get('programStatus')}")
        print(f"  Deleted: {data.get('deleted')}")
        print(f"  OrgUnit: {data.get('orgUnit')} ({data.get('orgUnitName')})")
        print(f"  Last Updated: {data.get('lastUpdated')}")
    else:
        print(f"Failed to fetch event {eid}: {res.status_code}")
