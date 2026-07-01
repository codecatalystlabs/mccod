import { offlineDataService } from './offlineDataService';

interface SyncResult {
  success: boolean;
  itemsProcessed: number;
  itemsFailed: number;
  errors: string[];
}

class SyncService {
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  /**
   * Sync all pending items in the queue
   */
  async syncAll(apiBaseUrl: string): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      itemsProcessed: 0,
      itemsFailed: 0,
      errors: []
    };

    if (!navigator.onLine) {
      result.success = false;
      result.errors.push('Device is offline. Cannot sync.');
      return result;
    }

    try {
      const queue = await offlineDataService.getSyncQueue();

      if (queue.length === 0) {
        console.log('No items to sync');
        return result;
      }

      console.log(`Starting sync of ${queue.length} items`);

      for (const item of queue) {
        try {
          await this.syncItem(item, apiBaseUrl);
          await offlineDataService.removeFromSyncQueue(item.id);
          result.itemsProcessed++;
        } catch (error) {
          result.itemsFailed++;
          result.errors.push(`Failed to sync item ${item.id}: ${error}`);
          console.error(`Error syncing item ${item.id}:`, error);

          // Increment retry count
          if (item.retries < this.maxRetries) {
            item.retries++;
            console.log(`Retrying item ${item.id} (attempt ${item.retries}/${this.maxRetries})`);
          } else {
            // Remove item after max retries
            await offlineDataService.removeFromSyncQueue(item.id);
            result.errors.push(`Item ${item.id} failed after ${this.maxRetries} retries`);
          }
        }
      }

      console.log(`Sync completed: ${result.itemsProcessed} processed, ${result.itemsFailed} failed`);
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync failed: ${error}`);
      console.error('Sync error:', error);
    }

    return result;
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: any, apiBaseUrl: string): Promise<void> {
    const { action, data } = item;

    let url = `${apiBaseUrl}/api/dataValues`;
    let method = 'POST';
    let body = data;

    switch (action) {
      case 'create':
        method = 'POST';
        break;
      case 'update':
        method = 'PUT';
        url = `${url}/${data.id}`;
        break;
      case 'delete':
        method = 'DELETE';
        url = `${url}/${data.id}`;
        break;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'DELETE' ? JSON.stringify(body) : undefined,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Listen for online event and auto-sync
   */
  setupAutoSync(apiBaseUrl: string): void {
    window.addEventListener('online', async () => {
      console.log('Device is back online. Starting auto-sync...');
      const result = await this.syncAll(apiBaseUrl);

      if (result.success) {
        console.log('Auto-sync completed successfully');
      } else {
        console.warn('Auto-sync completed with errors:', result.errors);
      }
    });
  }

  /**
   * Queue a form submission for sync
   */
  async queueFormSubmission(formData: any): Promise<void> {
    try {
      await offlineDataService.addToSyncQueue('create', formData);
      console.log('Form submission queued for sync');
    } catch (error) {
      console.error('Error queuing form submission:', error);
      throw error;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    pendingItems: number;
    isOnline: boolean;
  }> {
    try {
      const queue = await offlineDataService.getSyncQueue();
      return {
        pendingItems: queue.length,
        isOnline: navigator.onLine
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        pendingItems: 0,
        isOnline: navigator.onLine
      };
    }
  }
}

export const syncService = new SyncService();

