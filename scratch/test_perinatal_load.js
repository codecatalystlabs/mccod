/**
 * Diagnostic script: Test Perinatal → MCCOD field mapping
 * Run in browser console on the MCCOD app page.
 *
 * Purpose: Simulate what the Perinatal form sends via localStorage/URL params
 * and verify what ends up in mcodmap, what gets filtered out, and what's missing.
 */

// ── 1. What the Perinatal form (Perinatal_production.txt) sends ────────────
// These are the fields collected from the Perinatal HTML form (the `des` array + ZBvxrMFv9aW)
const perinatalDes = [
  "RpkIvgOOZJt",  // date and time of delivery
  "rDI0uhcVLAk",  // age in hours
  "ZKBE8Xm9DJG",  // Ministry of Health National Case Number
  "xpJgWYFpvht",  // mother's initials (used as baby name)
  "hTYVRRvhYEt",  // mother's age (years)
  "T0f4UTwxd6Q",  // village
  "rjoVXlCWLYM",  // age in minutes
  "rDI0uhcVLAk",  // age in hours (duplicate in des[])
  "quKRjZzkSRA",  // age in days
  "m8jUvzBgYga",  // weeks of amenorrhea at delivery
  "T0f4UTwxd6Q",  // village (duplicate in des[])
  "dKQIx7sVFbD",  // parish
  "H34bcwaOliX",  // IP Number (Newborn)
  "t5nTEmlScSt",  // district
  "u44XP9fZweA",  // subcounty
];
// Plus these are added separately:
const perinatalExtra = [
  "ZBvxrMFv9aW",  // sex of baby
  "orgUnit",       // org unit id
  "nationality",   // nationality
  "event",         // parent event id (the perinatal event)
  "babyName",      // "DECEASED BABY"
];

// ── 2. The mcodmap from Store.tsx ─────────────────────────────────────────
// Keys = Perinatal data element IDs, Values = MCCOD data element IDs
const mcodmap = {
  hcu4LCAMSkz: "dsiwvNQLe5n",   // village
  ByIsCiqkq4v: "ymyLrfEcYkD",
  jdxl2rdeDEk: "lQ1Byr04JTx",
  WzauwhVOwM0: "i8rrl8YWxLF",
  eJwpqR9t7YM: "RJhbkjYrODG",
  FIfoObQJvNp: "ZYKmQ9GPOaF",
  H34bcwaOliX: "FGagV1Utrdh",    // form 17 inpatient number ✓
  BRtcz4HV7Ak: "FGagV1Utrdh",   // form 20 inpatient number
  uFoaTRJ16Ch: "gNM2Yhypydx",
  K4FUK590rIU: "KsGOxFyzIs1",
  FHmHV9mElbD: "u44XP9fZweA",   // district
  ioXkKfrgCJa: "t5nTEmlScSt",   // subcounty
  iJqBq0kQtWO: "q7e7FOXKnOf",   // age mapping for 020
  AqXDMjrPUEE: "Z41di0TRjIu",
  XW2CKaAiMKc: "xAWYJtQsg8M",
  js6jQi1rx1j: "jY3K6Bv4o9Q",
  ZKBE8Xm9DJG: "ZKBE8Xm9DJG",   // case number ✓
  itNUbtIXfCT: "ZKBE8Xm9DJG",
  sfpqAeqKeyQ: "sfpqAeqKeyQ",
  zb7uTuBCPrN: "zb7uTuBCPrN",
  CnPGhOcERFF: "CnPGhOcERFF",
  xeE5TQLvucB: "xeE5TQLvucB",
  Ylht9kCLSRW: "Ylht9kCLSRW",
  myydnkmLfhp: "myydnkmLfhp",
  Q7VM7swIWb6: "Q7VM7swIWb6",
  QmcOqkcNTip: "QmcOqkcNTip",
  tuGPnGHWqQn: "tuGPnGHWqQn",
  QGFYJK00ES7: "QGFYJK00ES7",
  aC64sB86ThG: "aC64sB86ThG",
  cmZrrHfTxW3: "cmZrrHfTxW3",
  eCVDO6lt4go: "eCVDO6lt4go",
  hO8No9fHVd2: "hO8No9fHVd2",
  fleGy9CvHYh: "fleGy9CvHYh",
  WkXxkKEJLsg: "WkXxkKEJLsg",
  CupbOInqvJI: "MOstDqSY0gO",
  xpJgWYFpvht: "ZYKmQ9GPOaF",   // mother initials → baby name ✓
  ZBvxrMFv9aW: "e96GB4CXyd3",   // sex form 017 ✓
  rjoVXlCWLYM: "TgFI46omIEg",   // age minutes form 017 ✓
  rDI0uhcVLAk: "VJXpmHCaAFG",   // age hours form 017 ✓
  quKRjZzkSRA: "v8mvHHXo06E",   // age days form 017 ✓
  m8jUvzBgYga: "lQ1Byr04JTx",   // weeks of pregnancy form 017 ✓
  T0f4UTwxd6Q: "dsiwvNQLe5n",   // village form 017 ✓
  t5nTEmlScSt: "u44XP9fZweA",   // district form 017 → NOTE: maps to district field (u44XP9fZweA)
  u44XP9fZweA: "t5nTEmlScSt",   // subcounty form 017 → NOTE: maps to subcounty field (t5nTEmlScSt)
  Dq9aH0aZ2wb: "i8rrl8YWxLF",   // date/time of death form 17 ✓
  ZkNDFfFSTYg: "ZkNDFfFSTYg",   // linked value ✓
};

// ── 3. Check: which Perinatal fields are MISSING from mcodmap? ────────────
console.log("=== MISSING from mcodmap (fields sent by Perinatal but not mapped) ===");
const allPeriFields = [...new Set([...perinatalDes, ...perinatalExtra])];
allPeriFields.forEach(de => {
  if (!["orgUnit", "nationality", "event", "babyName"].includes(de)) {
    if (mcodmap[de] === undefined) {
      console.warn(`❌ MISSING: Perinatal field "${de}" has NO entry in mcodmap`);
    } else {
      console.log(`✓ MAPPED: ${de} → ${mcodmap[de]}`);
    }
  }
});

// ── 4. Key bugs identified ─────────────────────────────────────────────────
console.log("\n=== BUGS IDENTIFIED ===");

// Bug 1: RpkIvgOOZJt (Date and time of delivery) is sent but not in mcodmap
console.log(`\n[BUG 1] RpkIvgOOZJt (Date & Time of Delivery):
  - Sent by Perinatal form via olsdata
  - NOT in mcodmap → field is DROPPED and never reaches the MCCOD form
  - Fix: Add to mcodmap: RpkIvgOOZJt → "i8rrl8YWxLF" (Date of death) OR a dedicated field`);

// Bug 2: hTYVRRvhYEt (Mother's age) sent but not in mcodmap
console.log(`\n[BUG 2] hTYVRRvhYEt (Mother's Age in years):
  - Sent by Perinatal form via olsdata
  - NOT in mcodmap → field is DROPPED
  - Fix: Add to mcodmap if there's a corresponding MCCOD field for it`);

// Bug 3: dKQIx7sVFbD (parish) is sent but commented out in mcodmap
console.log(`\n[BUG 3] dKQIx7sVFbD (Parish):
  - Sent by Perinatal form via olsdata
  - In mcodmap the mapping is commented out → field is DROPPED`);

// Bug 4: defaultValues filter removes falsy values including false, 0, ""
console.log(`\n[BUG 4] defaultValues filter strips falsy values:
  - Store.tsx line ~2634: .filter((v: any) => !!v[1])
  - This removes values that are false, 0 (zero), or empty string ""
  - If any numeric field like age in minutes/hours/days is 0, it won't load
  - Fix: Change filter to .filter((v: any) => v[1] !== null && v[1] !== undefined)`);

// Bug 5: district/subcounty swap in mcodmap
console.log(`\n[BUG 5] District/Subcounty SWAP in mcodmap:
  - Perinatal t5nTEmlScSt (labeled "district") → maps to u44XP9fZweA (MCCOD's "district" field)  
  - Perinatal u44XP9fZweA (labeled "subcounty") → maps to t5nTEmlScSt (MCCOD's "subcounty" field)
  - The Perinatal HTML labels at lines 511-513 show the labels are SWAPPED:
      id="CGz50G2MY16-t5nTEmlScSt-val" has title "HMIS_100_  Subcounty" 
      id="CGz50G2MY16-u44XP9fZweA-val" has title "HMIS_100_  District"
  - This means the HTML labels and the mcodmap mapping disagree on which is district vs subcounty`);

// ── 5. Simulate what actually flows through ────────────────────────────────
console.log("\n=== SIMULATION: What actually gets mapped ===");
// Pretend the Perinatal form collected these values:
const sampleLsdata = {
  RpkIvgOOZJt: "2024-06-15T10:30:00",  // delivery date
  rDI0uhcVLAk: "3",                      // age in hours
  ZKBE8Xm9DJG: "PERI-ABC123DEF456",     // case number
  xpJgWYFpvht: "JD",                    // mother's initials
  hTYVRRvhYEt: "28",                    // mother's age
  T0f4UTwxd6Q: "Buwenge",              // village
  rjoVXlCWLYM: "45",                    // age in minutes
  quKRjZzkSRA: "0",                     // age in days (0 = day 0, will be FILTERED!)
  m8jUvzBgYga: "38",                    // weeks of amenorrhea
  dKQIx7sVFbD: "Buwenge Parish",       // parish
  H34bcwaOliX: "12345",                 // IP Number
  t5nTEmlScSt: "Jinja",                 // district
  u44XP9fZweA: "Buwenge",              // subcounty
  ZBvxrMFv9aW: "Male",                  // sex
  orgUnit: "FvewOonC8lS",
  nationality: "1. National",
  event: "eventId123",
  babyName: "DECEASED BABY",
};

console.log("\nMapped values (simulating defaultValues merge):");
Object.entries(sampleLsdata).forEach(([key, value]) => {
  if (["orgUnit", "nationality", "event", "babyName"].includes(key)) return;
  const mappedKey = mcodmap[key] ?? key;
  const isMissing = mcodmap[key] === undefined;
  const isFiltered = !value && value !== 0 && value !== false;
  
  if (isMissing) {
    console.warn(`  ❌ ${key}="${value}" → NOT MAPPED (dropped)`);
  } else if (isFiltered) {
    console.warn(`  ⚠️  ${mappedKey}="${value}" → FILTERED OUT (falsy value filter)`);
  } else {
    console.log(`  ✓ ${key}="${value}" → ${mappedKey}="${value}"`);
  }
});

// Check specifically for quKRjZzkSRA = "0" (age in days)
console.log("\n[Check] quKRjZzkSRA='0' (age in days = 0):");
const ageInDaysValue = "0"; // as string from the form
console.log(`  !!${JSON.stringify(ageInDaysValue)} = ${!!ageInDaysValue}`);
console.log(`  → Value "0" is TRUTHY as a string, so it won't be filtered.`);
console.log(`  → But numeric 0 (after parseInt/Number) would be FALSY and get filtered.`);

console.log("\n=== SUMMARY OF FIXES NEEDED ===");
console.log("1. Add RpkIvgOOZJt to mcodmap (Date & Time of Delivery)");
console.log("2. Add hTYVRRvhYEt to mcodmap (Mother's Age) if applicable");  
console.log("3. Uncomment dKQIx7sVFbD mapping (Parish)");
console.log("4. Fix defaultValues filter: .filter((v: any) => v[1] !== null && v[1] !== undefined)");
console.log("5. Verify district/subcounty label vs mapping consistency");
console.log("6. Remove duplicate entries in Perinatal des[] array (rDI0uhcVLAk and T0f4UTwxd6Q appear twice)");
