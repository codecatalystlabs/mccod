# How Offline Sync Works - Detailed Explanation

## Overview

The offline sync system allows users to submit forms while offline, and automatically syncs them to the server when the connection is restored. Here's how it works step-by-step:

---

## Step 1: User Submits Form While Offline

### What Happens:
```
User fills out Death Certificate form → Clicks Submit
```

### Code Flow:
```typescript
// In your form component
const handleSubmit = async (formData) => {
  if (!navigator.onLine) {
    // Device is offline
    await syncService.queueFormSubmission(formData);
    // Form is queued, not sent to server
  } else {
    // Device is online - send directly
    await submitToServer(formData);
  }
};
```

### What Gets Stored:
The form data is stored in **IndexedDB** with this structure:

```javascript
{
  id: "create_1699564800000_0.123",
  action: "create",
  data: {
    // All form fields
    deathCertificateNumber: "DC-2024-001",
    dateOfDeath: "2024-01-15",
    causeOfDeath: "Disease",
    // ... more fields
  },
  timestamp: 1699564800000,
  retries: 0
}
```

---

## Step 2: Data Stored in IndexedDB

### Three Object Stores:

1. **formData** - Stores form data for restoration
   ```
   {
     id: "form-1",
     data: { /* form fields */ },
     timestamp: 1699564800000,
     synced: false
   }
   ```

2. **syncQueue** - Stores pending submissions
   ```
   {
     id: "create_1699564800000_0.123",
     action: "create",
     data: { /* form data */ },
     timestamp: 1699564800000,
     retries: 0
   }
   ```

3. **organisationUnits** - Caches districts, subcounties, etc.
   ```
   {
     id: "unit-123",
     displayName: "Kampala District",
     level: 3
   }
   ```

### Storage Location:
- **Browser:** Chrome DevTools → Application → IndexedDB → MCCOD_DB
- **Capacity:** ~50MB per domain (varies by browser)
- **Persistence:** Survives browser restart

---

## Step 3: Device Comes Back Online

### What Triggers Sync:

```typescript
// In syncService.ts
setupAutoSync(apiBaseUrl) {
  window.addEventListener('online', async () => {
    console.log('Device is back online. Starting auto-sync...');
    const result = await this.syncAll(apiBaseUrl);
  });
}
```

### Events That Trigger:
1. ✅ Device reconnects to WiFi
2. ✅ Device switches from mobile data to WiFi
3. ✅ User manually clicks "Sync Now" button
4. ✅ App detects `navigator.onLine` changed to `true`

---

## Step 4: Sync Process Begins

### Phase 1: Retrieve Queued Items
```typescript
const queue = await offlineDataService.getSyncQueue();
// Returns all items waiting to be synced
```

### Phase 2: Process Each Item
```typescript
for (const item of queue) {
  try {
    await this.syncItem(item, apiBaseUrl);
    // If successful, remove from queue
    await offlineDataService.removeFromSyncQueue(item.id);
    result.itemsProcessed++;
  } catch (error) {
    // Handle error and retry
  }
}
```

### Phase 3: Send to Server
```typescript
// Determine HTTP method based on action
const method = item.action === 'create' ? 'POST' : 'PUT';
const url = `${apiBaseUrl}/api/dataValues`;

const response = await fetch(url, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(item.data),
  credentials: 'include'
});
```

---

## Step 5: Handle Server Response

### Success (HTTP 200-299):
```
✓ Server accepts the data
✓ Item removed from sync queue
✓ User sees success notification
✓ Data is now on server
```

### Failure (HTTP 4xx, 5xx):
```
✗ Server rejects the data
✗ Retry count incremented
✗ If retries < 3: Keep in queue for retry
✗ If retries >= 3: Remove from queue, show error
```

### Retry Logic:
```typescript
if (item.retries < this.maxRetries) {
  item.retries++;
  // Keep in queue, will retry next time
} else {
  // Remove after 3 failed attempts
  await offlineDataService.removeFromSyncQueue(item.id);
}
```

---

## Complete Sync Flow Example

### Scenario: Health Worker Offline

**Time 10:00 AM - OFFLINE**
```
1. Health worker fills death certificate form
2. Clicks "Submit"
3. App detects: navigator.onLine = false
4. Form saved to IndexedDB
5. Item added to syncQueue
6. User sees: "✓ Form saved locally. Will sync when online"
```

**Time 10:15 AM - BACK ONLINE**
```
1. Device reconnects to internet
2. Browser fires 'online' event
3. setupAutoSync() listener catches it
4. syncService.syncAll() starts
5. Retrieves 1 item from syncQueue
6. Sends POST request to server
7. Server responds: HTTP 200 OK
8. Item removed from syncQueue
9. User sees: "✓ Synced successfully"
```

**Time 10:20 AM - OFFLINE AGAIN**
```
1. Device loses connection
2. Health worker fills another form
3. Clicks "Submit"
4. Form saved to IndexedDB
5. Now syncQueue has 0 items (previous one synced)
6. New item added to syncQueue
```

---

## Key Features

### ✅ Automatic Sync
- Triggers automatically when device comes online
- No user action required

### ✅ Retry Logic
- Failed items retry up to 3 times
- Prevents data loss from temporary network issues

### ✅ Manual Sync
- User can click "Sync Now" button anytime
- Useful if auto-sync fails

### ✅ Status Indicators
- Shows pending sync count
- Shows online/offline status
- Shows sync progress

### ✅ Data Persistence
- Data survives browser restart
- Data survives app crash
- Data survives device restart

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER OFFLINE                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Form Submission                                            │
│       ↓                                                      │
│  Check: navigator.onLine?                                  │
│       ↓                                                      │
│  NO → Save to IndexedDB                                    │
│       ↓                                                      │
│  Add to syncQueue                                          │
│       ↓                                                      │
│  Show: "Saved locally"                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   DEVICE COMES ONLINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  'online' event fired                                       │
│       ↓                                                      │
│  setupAutoSync() listener triggered                        │
│       ↓                                                      │
│  Get all items from syncQueue                              │
│       ↓                                                      │
│  For each item:                                            │
│    - Determine action (POST/PUT/DELETE)                   │
│    - Send to server                                        │
│    - If success: Remove from queue                         │
│    - If fail: Increment retries                            │
│       ↓                                                      │
│  Show sync results to user                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Usage Example

### Setup Auto-Sync in App:
```typescript
import { syncService } from './services/syncService';

useEffect(() => {
  syncService.setupAutoSync(apiBaseUrl);
}, [apiBaseUrl]);
```

### Queue a Form Submission:
```typescript
import { syncService } from './services/syncService';

const handleSubmit = async (formData) => {
  if (!navigator.onLine) {
    await syncService.queueFormSubmission(formData);
  } else {
    await submitToServer(formData);
  }
};
```

### Manual Sync:
```typescript
import { syncService } from './services/syncService';

const handleManualSync = async () => {
  const result = await syncService.syncAll(apiBaseUrl);
  console.log(`Synced: ${result.itemsProcessed}, Failed: ${result.itemsFailed}`);
};
```

### Check Sync Status:
```typescript
const status = await syncService.getSyncStatus();
console.log(`Pending items: ${status.pendingItems}`);
console.log(`Is online: ${status.isOnline}`);
```

---

## Error Handling

### Network Errors:
- Automatically retried up to 3 times
- User notified after 3 failed attempts

### Server Errors (4xx, 5xx):
- Treated as sync failures
- Retried on next sync attempt

### IndexedDB Errors:
- Logged to console
- User notified if critical

---

## Performance Considerations

- **Sync Speed:** Depends on data size and network speed
- **Storage:** ~50MB available per domain
- **Battery:** Minimal impact (only syncs when online)
- **Data Usage:** Only syncs pending items

---

## Browser Support

✅ Chrome 24+
✅ Firefox 16+
✅ Safari 10+
✅ Edge 79+
✅ Android Browser 4.4+

