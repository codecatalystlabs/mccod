# Manner of Death Checkbox Testing Guide

## Overview
This document outlines the test cases for the "Manner of death" section which now uses checkboxes with mutual exclusivity (only one can be selected at a time).

## Test Environment
- **URL:** http://localhost:3000
- **Component:** DataEntryForm (Manner of death section)
- **Location:** In the form, scroll down to find the "Manner of death" section

## Test Cases

### Test Case 1: Initial State
**Objective:** Verify all checkboxes are enabled initially
**Steps:**
1. Navigate to the form
2. Scroll to the "Manner of death" section
3. Observe all 9 checkboxes

**Expected Result:**
- All checkboxes should be visible and enabled (not greyed out)
- None should be checked

---

### Test Case 2: Select Disease Checkbox
**Objective:** Verify that selecting "Disease" disables all other checkboxes AND the "If external cause or poisoning" section
**Steps:**
1. Click the "Disease" checkbox
2. Observe the state of other checkboxes
3. Scroll down to the "If external cause or poisoning" section
4. Verify all fields in that section are disabled

**Expected Result:**
- "Disease" checkbox should be checked
- All other 8 checkboxes should be disabled (greyed out)
- Other checkboxes should NOT be clickable
- "If external cause or poisoning" section should be completely disabled:
  - Radio buttons (Yes/No) should be greyed out
  - "Date of injury" DatePicker should be greyed out
  - "Please describe how external cause occurred" input should be greyed out
  - "Place of occurrence of the external cause" input should be greyed out

---

### Test Case 3: Select Different Checkbox (Assault)
**Objective:** Verify that selecting a different checkbox unchecks the previous one
**Steps:**
1. With "Disease" checked, click the "Assault" checkbox
2. Observe the state of all checkboxes

**Expected Result:**
- "Disease" checkbox should be unchecked
- "Assault" checkbox should be checked
- All other 7 checkboxes should be disabled (greyed out)

---

### Test Case 4: Uncheck Selected Checkbox
**Objective:** Verify that unchecking enables all checkboxes again
**Steps:**
1. With "Assault" checked, click it again to uncheck
2. Observe the state of all checkboxes

**Expected Result:**
- "Assault" checkbox should be unchecked
- All 9 checkboxes should be enabled (not greyed out)
- All should be clickable

---

### Test Case 5: Test All Checkboxes
**Objective:** Verify each checkbox works correctly
**Steps:**
1. For each of the 9 checkboxes:
   - Click to select it
   - Verify all others are disabled
   - Click to uncheck it
   - Verify all are enabled again

**Checkboxes to test:**
1. Disease
2. Assault
3. Could not be determined
4. Accident
5. Legal intervention
6. Pending investigation
7. Intentional self-harm
8. War
9. Unknown

**Expected Result:**
- Each checkbox should work independently
- When selected, all others should be disabled
- When unselected, all should be enabled

---

### Test Case 6: Rapid Selection
**Objective:** Verify rapid checkbox switching works smoothly
**Steps:**
1. Quickly click different checkboxes in succession
2. Observe the enable/disable behavior

**Expected Result:**
- Only one checkbox should be checked at any time
- No errors in console
- Smooth transitions between selections

---

### Test Case 7: Disease Disables External Cause Section
**Objective:** Verify that selecting "Disease" completely disables the "If external cause or poisoning" section
**Steps:**
1. Select "Disease" checkbox
2. Scroll down to "If external cause or poisoning" section
3. Try to interact with the fields (Radio buttons, DatePicker, Input fields)
4. Uncheck "Disease"
5. Verify the section becomes enabled again

**Expected Result:**
- When "Disease" is checked:
  - All fields in "If external cause or poisoning" section are disabled (greyed out)
  - Cannot click or interact with any fields in that section
- When "Disease" is unchecked:
  - All fields in "If external cause or poisoning" section are enabled again
  - Can interact with fields normally

---

### Test Case 8: Form Submission
**Objective:** Verify the form can be submitted with a manner of death selected
**Steps:**
1. Select one manner of death checkbox
2. Fill in other required fields
3. Submit the form

**Expected Result:**
- Form should submit successfully
- Selected manner of death value should be captured

---

## Visual Verification Checklist

- [ ] Checkboxes are displayed in a table layout
- [ ] Checkboxes have proper labels
- [ ] Disabled checkboxes appear greyed out
- [ ] Enabled checkboxes appear normal
- [ ] Only one checkbox can be checked at a time
- [ ] When "Disease" is selected, "If external cause or poisoning" section is completely disabled
- [ ] When "Disease" is unchecked, "If external cause or poisoning" section is enabled again
- [ ] No console errors appear during testing

---

## Notes
- The checkboxes are organized in 3 rows with 3 columns each
- The disable logic is implemented using `form.getFieldValue()` to check other fields
- The implementation maintains backward compatibility with existing form logic

---

# Fetal or Infant Section - Testing Guide

## Overview
This document outlines the test cases for the "Fetal or infant" section which now disables the "Stillborn?" field when "Infant" is selected.

## Test Environment
- **URL:** http://localhost:3000
- **Component:** DataEntryForm (Fetal or infant section)
- **Location:** In the form, scroll down to find the "Fetal or infant" section

## Test Cases

### Test Case 1: Initial State
**Objective:** Verify the "Stillborn?" field is enabled initially
**Steps:**
1. Navigate to the form
2. Scroll to the "Fetal or infant" section
3. Observe the "Stillborn?" field

**Expected Result:**
- "Fetal or infant" dropdown should be visible
- "Stillborn?" field should be enabled (not greyed out)

---

### Test Case 2: Select "Fetal"
**Objective:** Verify that selecting "Fetal" keeps "Stillborn?" enabled
**Steps:**
1. Click the "Fetal or infant" dropdown
2. Select "Fetal"
3. Observe the "Stillborn?" field

**Expected Result:**
- "Fetal" should be selected
- "Stillborn?" field should remain enabled (not greyed out)
- User can interact with "Stillborn?" field

---

### Test Case 3: Select "Infant"
**Objective:** Verify that selecting "Infant" disables "Stillborn?" field
**Steps:**
1. Click the "Fetal or infant" dropdown
2. Select "Infant"
3. Observe the "Stillborn?" field

**Expected Result:**
- "Infant" should be selected
- "Stillborn?" field should be disabled (greyed out)
- User cannot interact with "Stillborn?" field

---

### Test Case 4: Switch from "Infant" to "Fetal"
**Objective:** Verify that switching back to "Fetal" re-enables "Stillborn?" field
**Steps:**
1. With "Infant" selected, click the "Fetal or infant" dropdown
2. Select "Fetal"
3. Observe the "Stillborn?" field

**Expected Result:**
- "Fetal" should be selected
- "Stillborn?" field should be enabled again (not greyed out)
- User can interact with "Stillborn?" field

---

### Test Case 5: Clear Selection
**Objective:** Verify that clearing the "Fetal or infant" selection enables "Stillborn?" field
**Steps:**
1. With "Infant" selected, click the "Fetal or infant" dropdown
2. Clear the selection (if possible)
3. Observe the "Stillborn?" field

**Expected Result:**
- "Fetal or infant" dropdown should be empty
- "Stillborn?" field should be enabled (not greyed out)

---

## Visual Verification Checklist

- [ ] "Fetal or infant" dropdown is visible and functional
- [ ] "Stillborn?" field is enabled when "Fetal" is selected
- [ ] "Stillborn?" field is disabled (greyed out) when "Infant" is selected
- [ ] Switching between "Fetal" and "Infant" works smoothly
- [ ] No console errors appear during testing

