import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../shared/data-access/storage.service';
import { ChecklistItem } from '../../shared/interfaces/check-list-item';
import { Observable, of } from 'rxjs';

const STORAGE_KEY = 'checklistItems';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemStorageService {
  private storage = inject(StorageService);

  loadChecklistItems(): Observable<ChecklistItem[]> {
    const items = this.storage.load<ChecklistItem[]>(STORAGE_KEY);
    return of(items ?? []);
  }

  saveChecklistItems(checklistItems: ChecklistItem[]): void {
    this.storage.save<ChecklistItem[]>(STORAGE_KEY, checklistItems);
  }
}
