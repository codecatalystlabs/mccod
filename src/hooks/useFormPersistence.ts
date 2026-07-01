import { useEffect, useCallback } from 'react';
import { offlineDataService } from '../services/offlineDataService';

interface UseFormPersistenceOptions {
  formId: string;
  saveInterval?: number; // milliseconds
  onSave?: (data: any) => void;
  onRestore?: (data: any) => void;
}

/**
 * Hook for persisting form data to IndexedDB
 * Automatically saves form data at intervals and restores it on mount
 */
export const useFormPersistence = (
  formData: any,
  options: UseFormPersistenceOptions
) => {
  const {
    formId,
    saveInterval = 30000, // Default: save every 30 seconds
    onSave,
    onRestore
  } = options;

  // Restore form data on mount
  useEffect(() => {
    const restoreFormData = async () => {
      try {
        const savedData = await offlineDataService.getFormData(formId);
        if (savedData) {
          console.log('Restored form data from IndexedDB:', formId);
          if (onRestore) {
            onRestore(savedData);
          }
        }
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    };

    restoreFormData();
  }, [formId, onRestore]);

  // Save form data periodically
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await offlineDataService.saveFormData(formId, formData);
        console.log('Form data saved to IndexedDB:', formId);
        if (onSave) {
          onSave(formData);
        }
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    };

    const interval = setInterval(saveFormData, saveInterval);

    // Save immediately on unmount
    return () => {
      clearInterval(interval);
      saveFormData();
    };
  }, [formData, formId, saveInterval, onSave]);

  // Manual save function
  const saveNow = useCallback(async () => {
    try {
      await offlineDataService.saveFormData(formId, formData);
      console.log('Form data saved immediately:', formId);
      return true;
    } catch (error) {
      console.error('Error saving form data:', error);
      return false;
    }
  }, [formData, formId]);

  // Manual restore function
  const restoreNow = useCallback(async () => {
    try {
      const savedData = await offlineDataService.getFormData(formId);
      if (savedData && onRestore) {
        onRestore(savedData);
        console.log('Form data restored manually:', formId);
        return savedData;
      }
      return null;
    } catch (error) {
      console.error('Error restoring form data:', error);
      return null;
    }
  }, [formId, onRestore]);

  // Clear saved data
  const clearSavedData = useCallback(async () => {
    try {
      await offlineDataService.clearAllData();
      console.log('All saved data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing saved data:', error);
      return false;
    }
  }, []);

  return {
    saveNow,
    restoreNow,
    clearSavedData
  };
};

export default useFormPersistence;

