import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('window local storage object', {
  providedIn: 'root',
  factory: () => inject(PLATFORM_ID) === 'browser' ? window.localStorage : ({} as Storage)
});

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  load<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  save<T>(key: string, data: T): void {
    this.storage.setItem(key, JSON.stringify(data));
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}
