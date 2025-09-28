import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() { }

    // Set item in session storage
    setItem(key: string, value: any): void {
        try {
            const jsonValue = JSON.stringify(value);
            sessionStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error('Error saving to session storage', error);
        }
    }

    // Get item from session storage
    getItem<T>(key: string): T | null {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error reading from session storage', error);
            return null;
        }
    }

    // Remove item from session storage
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    // Clear all session storage
    clear(): void {
        localStorage.clear();
    }
}
