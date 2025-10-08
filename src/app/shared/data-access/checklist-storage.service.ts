import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Checklist } from '../interfaces/checklist';
import { Observable, of } from 'rxjs';

const STORAGE_KEY = 'checklist';

@Injectable({
  providedIn: 'root',
})
export class ChecklistStorageService {
  private storage = inject(StorageService);

  loadChecklists(): Observable<Checklist[]> {
    const checklists = this.storage.load<Checklist[]>(STORAGE_KEY);
    return of(checklists ?? []);
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.save<Checklist[]>(STORAGE_KEY, checklists);
  }
}
