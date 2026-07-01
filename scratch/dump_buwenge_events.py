import requests
import json

url = "https://hmis.health.go.ug"
auth_header = "Basic aGlzcC5za3VudW5rYTpBaWNvbm5lY3RAMTIzJA=="
program = "vf8dN49jprI"
org_unit_id = "XiavvWaLLRz"

headers = {
    "Authorization": auth_header,
    "Accept": "application/json"
}

events_url = f"{url}/api/events.json?program={program}&orgUnit={org_unit_id}&ouMode=DESCENDANTS&paging=false"
print(f"GET: {events_url}")
res = requests.get(events_url, headers=headers, timeout=30)

if res.status_code == 200:
    events = res.json().get("events", [])
    print(f"Retrieved {len(events)} events.")
    
    summary = []
    for ev in events:
        dvs = ev.get("dataValues", [])
        
        # Extract fields of interest
        inpatient_num = None
        case_num = None
        given_name = ""
        surname = ""
        full_name = ""
        
        for dv in dvs:
            de = dv.get("dataElement")
            val = dv.get("value")
            
            if de == "FGagV1Utrdh":
                inpatient_num = val
            elif de == "ZKBE8Xm9DJG":
                case_num = val
            elif de == "QmcOqkcNTip":
                given_name = val
            elif de == "Q7VM7swIWb6":
                surname = val
            elif de == "ZYKmQ9GPOaF":
                full_name = val
                
        summary.append({
            "event_id": ev.get("event"),
            "event_date": ev.get("eventDate"),
            "inpatient_num": inpatient_num,
            "case_num": case_num,
            "given_name": given_name,
            "surname": surname,
            "full_name": full_name,
            "all_data_values": dvs
        })
        
    output_file = "c:\\Users\\SK\\Documents\\Paul Mbaka hmis 100\\health-app\\scratch\\buwenge_events_summary.json"
    with open(output_file, "w") as f:
        json.dump(summary, f, indent=4)
    print(f"Dumped summary to {output_file}")
else:
    print(f"Failed to query events: {res.status_code}")
