/**
 * IndexedDB Large Storage Service
 * Native browser IndexedDB engine for large assets (custom fonts, PDF books, scanned documents)
 * Bypasses the 5MB browser localStorage quota limit with 100MB+ storage capacity.
 */

import { CustomFontItem, UserUploadedPdfBook } from '../types';

const DB_NAME = 'qazi_app_media_store_v2';
const DB_VERSION = 1;
const STORE_KEYVAL = 'app_keyval_store';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_KEYVAL)) {
        db.createObjectStore(STORE_KEYVAL);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.warn('IndexedDB open error:', request.error);
      reject(request.error);
    };
  });
}

export const idbStorage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_KEYVAL, 'readonly');
        const store = tx.objectStore(STORE_KEYVAL);
        const req = store.get(key);
        req.onsuccess = () => resolve((req.result as T) ?? null);
        req.onerror = () => {
          console.warn(`IndexedDB get error for key "${key}":`, req.error);
          resolve(null);
        };
      });
    } catch (e) {
      console.warn('idbStorage.get error:', e);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_KEYVAL, 'readwrite');
        const store = tx.objectStore(STORE_KEYVAL);
        const req = store.put(value, key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => {
          console.warn(`IndexedDB put error for key "${key}":`, req.error);
          resolve(false);
        };
      });
    } catch (e) {
      console.warn('idbStorage.set error:', e);
      return false;
    }
  },

  async delete(key: string): Promise<boolean> {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_KEYVAL, 'readwrite');
        const store = tx.objectStore(STORE_KEYVAL);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      console.warn('idbStorage.delete error:', e);
      return false;
    }
  },

  // Specialized helpers for Custom Fonts
  async getStoredCustomFonts(): Promise<CustomFontItem[]> {
    const fromIdb = await this.get<CustomFontItem[]>('custom_fonts');
    if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
      return fromIdb;
    }

    // Migration fallback from localStorage (clean up afterwards to free quota)
    if (typeof localStorage !== 'undefined') {
      try {
        const legacy = localStorage.getItem('qazi_app_custom_fonts_v1');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await this.set('custom_fonts', parsed);
            // Free localStorage quota immediately
            try {
              localStorage.removeItem('qazi_app_custom_fonts_v1');
            } catch {}
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Legacy font migration notice:', err);
      }
    }

    return [];
  },

  async saveStoredCustomFonts(fonts: CustomFontItem[]): Promise<void> {
    await this.set('custom_fonts', fonts);
  },

  // Specialized helpers for User Uploaded PDF Books
  async getStoredUserPdfBooks(): Promise<UserUploadedPdfBook[]> {
    const fromIdb = await this.get<UserUploadedPdfBook[]>('user_pdf_books');
    if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
      return fromIdb;
    }

    if (typeof localStorage !== 'undefined') {
      try {
        const legacy = localStorage.getItem('qazi_app_user_pdf_books_v1');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await this.set('user_pdf_books', parsed);
            try {
              localStorage.removeItem('qazi_app_user_pdf_books_v1');
            } catch {}
            return parsed;
          }
        }
      } catch {}
    }

    return [];
  },

  async saveStoredUserPdfBooks(books: UserUploadedPdfBook[]): Promise<void> {
    await this.set('user_pdf_books', books);
  },

  // Specialized helpers for Excel/PDF Hub scanned docs
  async getStoredPdfHubDocs(): Promise<any[]> {
    const fromIdb = await this.get<any[]>('pdf_hub_docs');
    if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
      return fromIdb;
    }

    if (typeof localStorage !== 'undefined') {
      try {
        const legacy = localStorage.getItem('qazi_app_uploaded_pdf_hub_v1');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await this.set('pdf_hub_docs', parsed);
            try {
              localStorage.removeItem('qazi_app_uploaded_pdf_hub_v1');
            } catch {}
            return parsed;
          }
        }
      } catch {}
    }

    return [];
  },

  async saveStoredPdfHubDocs(docs: any[]): Promise<void> {
    await this.set('pdf_hub_docs', docs);
  },
};
