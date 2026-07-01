# Offline Sync - Quick Reference Guide

## 🎯 What It Does

Allows users to submit forms while offline. When the device comes back online, all pending forms are automatically synced to the server.

---

## 📊 The 5-Step Process

### Step 1️⃣: User Submits Form (OFFLINE)
```
User fills form → Clicks Submit → App detects offline
↓
Form saved to IndexedDB
Item added to syncQueue
User sees: "✓ Saved locally"
```

### Step 2️⃣: Data Stored in IndexedDB
```
Database: MCCOD_DB
├── formData (auto-save every 30 seconds)
├── syncQueue (pending submissions)
└── organisationUnits (cached dropdowns)
```

### Step 3️⃣: Device Comes Online
```
Device reconnects → Browser fires 'online' event
↓
setupAutoSync() listener catches it
```

### Step 4️⃣: Sync Begins
```
Get all items from syncQueue
For each item:
  ├─ Determine action (POST/PUT/DELETE)
  ├─ Send to server
  └─ Handle response
```

### Step 5️⃣: Handle Response
```
✅ Success (HTTP 200)
   └─ Remove from queue
   └─ User sees: "✓ Synced"

❌ Failure (HTTP error)
   ├─ If retries < 3: Keep in queue, retry later
   └─ If retries >= 3: Remove, show error
```

---

## 🔧 Key Components

### 1. **offlineDataService.ts**
Manages IndexedDB operations

**Key Methods:**
```typescript
saveFormData(id, data)           // Save form data
getFormData(id)                  // Retrieve form data
addToSyncQueue(action, data)     // Queue submission
getSyncQueue()                   // Get all pending items
removeFromSyncQueue(id)          // Remove after sync
cacheOrganisationUnits(units)    // Cache dropdowns
```

### 2. **syncService.ts**
Handles syncing to server

**Key Methods:**
```typescript
syncAll(apiBaseUrl)              // Sync all pending items
syncItem(item, apiBaseUrl)       // Sync single item
setupAutoSync(apiBaseUrl)        // Listen for 'online' event
queueFormSubmission(formData)    // Queue a form
getSyncStatus()                  // Get pending count
```

### 3. **OfflineIndicator.tsx**
Shows status to user

**Features:**
- Online/offline badge
- Pending sync count
- Manual "Sync Now" button
- Status alerts

### 4. **useFormPersistence.ts**
Auto-save form data

**Features:**
- Auto-save every 30 seconds
- Restore on app load
- Manual save/restore
- Clear saved data

---

## 📱 User Experience

### Scenario 1: Offline Submission
```
1. Health worker fills death certificate
2. Clicks "Submit"
3. App shows: "✓ Form saved locally"
4. Form appears in pending list
5. No internet needed!
```

### Scenario 2: Auto-Sync
```
1. Device reconnects to internet
2. App automatically syncs pending forms
3. User sees: "Syncing... 3 items"
4. After sync: "✓ All synced successfully"
5. Pending list clears
```

### Scenario 3: Sync Failure
```
1. Server is down or network error
2. App retries up to 3 times
3. After 3 failures: "⚠ Failed to sync"
4. User can manually retry later
5. Data is NOT lost
```

---

## 🗄️ Data Storage

### IndexedDB Structure

**formData Store:**
```json
{
  "id": "form-1",
  "data": { /* all form fields */ },
  "timestamp": 1699564800000,
  "synced": false
}
```

**syncQueue Store:**
```json
{
  "id": "create_1699564800000_0.123",
  "action": "create",
  "data": { /* form data */ },
  "timestamp": 1699564800000,
  "retries": 0
}
```

**organisationUnits Store:**
```json
{
  "id": "unit-123",
  "displayName": "Kampala District",
  "level": 3
}
```

---

## 🔄 Sync Flow

```
┌─────────────────────────────────────────┐
│  User Offline - Submit Form             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Save to IndexedDB                      │
│  Add to syncQueue                       │
│  Show: "Saved locally"                  │
└──────────────┬──────────────────────────┘
               │
               ▼
        [WAITING FOR INTERNET]
               │
               ▼
┌─────────────────────────────────────────┐
│  Device Comes Online                    │
│  'online' event fired                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  setupAutoSync() triggered              │
│  Get items from syncQueue               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  For Each Item:                         │
│  - Send HTTP request to server          │
│  - Wait for response                    │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    SUCCESS       FAILURE
        │             │
        ▼             ▼
   Remove from    Retry < 3?
   syncQueue      ├─ YES: Keep in queue
        │         └─ NO: Remove & error
        │
        ▼
┌─────────────────────────────────────────┐
│  Sync Complete                          │
│  Show: "✓ All synced"                   │
└─────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Retry Settings
```typescript
// In syncService.ts
private maxRetries = 3;           // Max retry attempts
private retryDelay = 5000;        // 5 seconds between retries
```

### Auto-Save Settings
```typescript
// In useFormPersistence.ts
saveInterval = 30000;             // Save every 30 seconds
```

### Database Settings
```typescript
// In offlineDataService.ts
dbName = 'MCCOD_DB';              // Database name
dbVersion = 1;                    // Schema version
```

---

## 🚀 How to Use

### 1. Setup Auto-Sync
```typescript
import { syncService } from './services/syncService';

useEffect(() => {
  syncService.setupAutoSync(apiBaseUrl);
}, [apiBaseUrl]);
```

### 2. Queue Form Submission
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

### 3. Add Components to App
```tsx
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';

<PWAUpdateNotification />
<OfflineIndicator />
```

### 4. Add Form Persistence
```typescript
import { useFormPersistence } from './hooks/useFormPersistence';

const { saveNow, restoreNow } = useFormPersistence(formData, {
  formId: 'death-certificate-form',
  onRestore: setFormData
});
```

---

## 🔍 Debugging

### Check Pending Items
```javascript
// In browser console
const queue = await offlineDataService.getSyncQueue();
console.log('Pending items:', queue);
```

### Check Sync Status
```javascript
const status = await syncService.getSyncStatus();
console.log('Pending:', status.pendingItems);
console.log('Online:', status.isOnline);
```

### View IndexedDB
```
Chrome DevTools → Application → IndexedDB → MCCOD_DB
```

### Check Service Worker
```
Chrome DevTools → Application → Service Workers
```

---

## ✅ Testing Checklist

- [ ] Submit form while offline
- [ ] Verify form saved to IndexedDB
- [ ] Go online and verify auto-sync
- [ ] Check server received data
- [ ] Test manual sync button
- [ ] Test retry logic (simulate server error)
- [ ] Test form restoration after reload
- [ ] Test on mobile device
- [ ] Test with poor network (throttle)
- [ ] Test with multiple pending items

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| Storage Capacity | ~50MB per domain |
| Auto-save Interval | 30 seconds |
| Sync Retry Delay | 5 seconds |
| Max Retries | 3 attempts |
| Bundle Size Impact | +~50KB (gzipped) |

---

## 🌐 Browser Support

✅ Chrome 24+
✅ Firefox 16+
✅ Safari 10+
✅ Edge 79+
✅ Android Browser 4.4+

---

## 📚 Related Files

- `src/services/offlineDataService.ts` - Data management
- `src/services/syncService.ts` - Sync logic
- `src/components/OfflineIndicator.tsx` - Status UI
- `src/components/PWAUpdateNotification.tsx` - Update notifications
- `src/hooks/useFormPersistence.ts` - Form persistence
- `OFFLINE_SYNC_EXPLANATION.md` - Detailed explanation

