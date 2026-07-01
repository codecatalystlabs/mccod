import json

input_file = "c:\\Users\\SK\\Documents\\Paul Mbaka hmis 100\\health-app\\scratch\\buwenge_events_summary.json"

with open(input_file, "r") as f:
    events = json.load(f)

print(f"Total events loaded: {len(events)}")

print("\n--- All non-null Inpatient Numbers / Case Numbers for Buwenge General Hospital ---")
inpatient_nums = []
case_nums = []
for ev in events:
    ip = ev.get("inpatient_num")
    cn = ev.get("case_num")
    if ip:
        inpatient_nums.append((ip, ev.get("event_id"), ev.get("event_date")))
    if cn:
        case_nums.append((cn, ev.get("event_id"), ev.get("event_date")))

print(f"Inpatient numbers (FGagV1Utrdh) found ({len(inpatient_nums)}):")
for ip, ev_id, dt in sorted(inpatient_nums):
    print(f"  - '{ip}' (Event: {ev_id}, Date: {dt})")

print(f"\nCase numbers (ZKBE8Xm9DJG) found ({len(case_nums)}):")
for cn, ev_id, dt in sorted(case_nums):
    print(f"  - '{cn}' (Event: {ev_id}, Date: {dt})")

# Let's search for 1669 anywhere in the raw data values of each event
print("\n--- Searching for '1669' in any data values ---")
found_1669 = False
for ev in events:
    for dv in ev.get("all_data_values", []):
        val = str(dv.get("value", ""))
        if "1669" in val:
            print(f"Found '1669' in event {ev.get('event_id')} (Date: {ev.get('event_date')})!")
            print(f"  Data element: {dv.get('dataElement')}, Value: '{val}'")
            found_1669 = True

if not found_1669:
    print("No data element value in any of the 50 events contains the string '1669'.")
