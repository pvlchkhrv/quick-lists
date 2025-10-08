import { computed, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem
} from '../../shared/interfaces/check-list-item';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
  });

  // selectors
  checklistItems = computed(() => this.state().checklistItems);

  // sources
  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  toggle$ = new Subject<ChecklistItem['id']>();
  reset$ = new Subject<ChecklistItem['id']>();

  constructor() {
    // reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((itemToAdd) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...itemToAdd.item,
            id: Date.now().toString(),
            checklistId: itemToAdd.checklistId,
            checked: false,
          },
        ],
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((itemToEdit) => {
      this.state.update(state => ({
        ...state,
        checklistItems: state.checklistItems.map(
          item => item.id === itemToEdit.id ? ({ ...item, ...itemToEdit.data }) : item
        )
      }))
    });

    this.remove$.pipe(takeUntilDestroyed()).subscribe((itemToRemove) => {
      this.state.update(state => ({
        ...state,
        checklistItems: state.checklistItems.filter(item => item.id !== itemToRemove)
      }));
    });

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((id) => {
      this.state.update(state => ({
        ...state,
        checklistItems: state.checklistItems.map(
          item => item.id === id ? ({ ...item, checked: !item.checked }) : item
        )
      }));
    });

    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) => {
      this.state.update(state => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
    });
  }
}
