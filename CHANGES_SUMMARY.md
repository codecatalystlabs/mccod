# Manner of Death Section - Changes Summary

## Overview
Modified the "Manner of death" section in the death certificate form to:
1. Use checkboxes instead of radio buttons
2. Disable all other checkboxes when one is selected (mutual exclusivity)
3. Completely disable the "If external cause or poisoning" section when "Disease" is selected

## Files Modified
- `src/components/Form.tsx` (Lines 5354-5725)

## Changes Made

### 1. Converted Radio.Group to Individual Checkboxes
**Location:** Lines 5354-5626

Changed from a single Radio.Group to individual checkbox fields organized in 3 rows:

**Row 1:**
- Disease (FhHPxY16vet)
- Assault (KsGOxFyzIs1)
- Could not be determined (b4yPk98om7e)

**Row 2:**
- Accident (gNM2Yhypydx)
- Legal intervention (tYH7drlbNya)
- Pending investigation (fQWuywOaoN2)

**Row 3:**
- Intentional self-harm (wX3i3gkTG4m)
- War (xDMX2CJ4Xw3)
- Unknown (o1hG9vr0peF)

### 2. Added Mutual Exclusivity Logic
Each checkbox now has a `disabled` property that checks if ANY other manner of death checkbox is selected:

```tsx
disabled={
    store.viewMode ||
    store.allDisabled.FhHPxY16vet ||
    (form.getFieldValue("KsGOxFyzIs1") ||
    form.getFieldValue("b4yPk98om7e") ||
    form.getFieldValue("gNM2Yhypydx") ||
    form.getFieldValue("tYH7drlbNya") ||
    form.getFieldValue("fQWuywOaoN2") ||
    form.getFieldValue("wX3i3gkTG4m") ||
    form.getFieldValue("xDMX2CJ4Xw3") ||
    form.getFieldValue("o1hG9vr0peF"))
}
```

### 3. Disabled "If External Cause or Poisoning" Section When Disease is Selected
**Location:** Lines 5637-5725

Modified three fields to be disabled when "Disease" (FhHPxY16vet) is selected:

**a) Radio.Group (Yes/No for external cause)** - Line 5640-5644
```tsx
disabled={
    store.viewMode || 
    store.allDisabled.AZSlwlRAFig ||
    form.getFieldValue("FhHPxY16vet")
}
```

**b) Date of Injury DatePicker** - Line 5665-5669
```tsx
disabled={
    store.viewMode ||
    store.allDisabled.U18Tnfz9EKd ||
    form.getFieldValue("FhHPxY16vet")
}
```

**c) Description Input Field** - Line 5695
```tsx
disabled={!form.getFieldValue('AZSlwlRAFig') || form.getFieldValue("FhHPxY16vet")}
```

**d) Place of Occurrence Input Field** - Line 5721
```tsx
disabled={!form.getFieldValue('AZSlwlRAFig') || form.getFieldValue("FhHPxY16vet")}
```

## Behavior

### When No Checkbox is Selected
- All 9 manner of death checkboxes are enabled
- "If external cause or poisoning" section is enabled (if AZSlwlRAFig is "Yes")

### When Any Checkbox is Selected
- That checkbox is checked
- All other 8 checkboxes are disabled (greyed out)
- If "Disease" is selected:
  - All fields in "If external cause or poisoning" section are disabled
  - User cannot interact with those fields

### When the Selected Checkbox is Unchecked
- All 9 checkboxes become enabled again
- "If external cause or poisoning" section becomes enabled again

## Testing
See `TEST_MANNER_OF_DEATH.md` for comprehensive test cases.

## Backward Compatibility
- Existing form logic and validation remain unchanged
- The changes only affect the UI behavior and field interactions
- Data submission format remains the same

---

# Fetal or Infant Section - Changes

## Overview
Modified the "Fetal or infant" section to disable the "Stillborn?" field when "Infant" is selected.

## File Modified
- `src/components/Form.tsx` (Line 5833)

## Change Made

### Disabled "Stillborn?" Field When "Infant" is Selected
**Location:** Line 5833

Modified the disable condition for the "Stillborn?" field:

**Before:**
```tsx
personsAge > 1
```

**After:**
```tsx
personsAge > 1 || form.getFieldValue("fetal") === "Infant"
```

## Behavior

### When "Fetal" is Selected
- "Stillborn?" field is enabled (can be interacted with)

### When "Infant" is Selected
- "Stillborn?" field is disabled (greyed out)
- User cannot interact with the field

### When No Selection is Made
- "Stillborn?" field is enabled (can be interacted with)

## Logic
The "Stillborn?" field is now disabled when:
1. Person's age is greater than 1 year, OR
2. "Infant" is selected in the "Fetal or infant" dropdown

This makes sense because:
- Stillborn is only applicable to fetuses, not infants
- An infant by definition is already born, so "stillborn" doesn't apply

---

# Bug Fix: optionSet Function Not Using Disabled Parameter

## Issue
The `optionSet` function was accepting a `disabled` parameter but not actually using it in the Select component's disabled prop.

## File Modified
- `src/components/Form.tsx` (Line 1530)

## Change Made

### Updated optionSet Function to Use Disabled Parameter
**Location:** Line 1530

**Before:**
```tsx
disabled={
    store.viewMode || store.allDisabled[field]
}
```

**After:**
```tsx
disabled={
    store.viewMode || store.allDisabled[field] || disabled
}
```

## Impact
This fix ensures that when the `disabled` parameter is passed to the `optionSet` function, it will actually disable the Select component. This is critical for the "Stillborn?" field to be properly disabled when "Infant" is selected.

---

# SubCounty Dropdown - Dynamic Base URL Loading

## Overview
Modified the SubCounty dropdown to load dynamically based on the base URL (like the District dropdown) instead of using a hardcoded URL.

## File Modified
- `src/components/Form.tsx` (Lines 389-411)

## Change Made

### Updated fetchSubCounties Function to Use Dynamic Base URL
**Location:** Lines 389-411

**Before:**
```tsx
const fetchSubCounties = async () => {
    try {
        const response = await fetch(
            `https://hmis.health.go.ug/api/organisationUnits/${chosenDistrictId}?paging=false&fields=level,id,children[id,displayName,level,children[id,displayName,level]]`
        );
        const data = await response.json();
        // ... rest of code
    }
};
```

**After:**
```tsx
const fetchSubCounties = async () => {
    try {
        const url = `/api/organisationUnits/${chosenDistrictId}?paging=false&fields=level,id,children[id,displayName,level,children[id,displayName,level]]`;
        const data = await store.engine.link.fetch(url);
        // ... rest of code
    }
};
```

## Key Changes
1. **Removed hardcoded URL**: `https://hmis.health.go.ug/api/organisationUnits/...`
2. **Added relative URL**: `/api/organisationUnits/...`
3. **Changed fetch method**: From `fetch()` to `store.engine.link.fetch()`

## Benefits
- ✅ **Dynamic Base URL**: Now uses the configured base URL from the application settings
- ✅ **Consistency**: Matches the pattern used by the District dropdown and other API calls
- ✅ **Environment Flexibility**: Works across different environments (dev, staging, production) without code changes
- ✅ **Automatic Authentication**: Uses the store's engine which handles authentication tokens automatically

---

# SubCounty Level Correction

## Overview
Corrected the organisation unit level used for subcounty from level 5 to level 4.

## File Modified
- `src/components/Form.tsx` (Lines 389-407)

## Change Made

### Updated fetchSubCounties to Use Level 4
**Location:** Lines 389-407

**Before:**
```tsx
// Extract sub-counties (level 5) from the nested children
const level4Units = data?.children ?? [];

const level5SubCounties = level4Units.flatMap((level4) =>
    (level4.children ?? []).filter(child => child.level === 5)
);
```

**After:**
```tsx
// Extract sub-counties (level 4) from the district's children
const level4SubCounties = (data?.children ?? []).filter(child => child.level === 4);
```

## Key Changes
1. **Simplified logic**: Removed nested flatMap and directly filter district's children
2. **Correct level**: Now filters for level 4 (subcounty) instead of level 5
3. **Simplified API fields**: Changed from `children[id,displayName,level,children[id,displayName,level]]` to `children[id,displayName,level]` since we only need direct children

## Result
SubCounties are now correctly identified as level 4 organisation units, matching your system's hierarchy.

