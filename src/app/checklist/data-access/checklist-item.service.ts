import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { catchError, EMPTY, map, merge, Subject } from 'rxjs';
import {
  AddChecklistItem,
  ChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem
} from '../../shared/interfaces/check-list-item';
import { ChecklistItemStorageService } from './checklist-item-storage.service';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private checklistItemStorage = inject(ChecklistItemStorageService);

  // state
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);

  // sources
  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  toggle$ = new Subject<ChecklistItem['id']>();
  reset$ = new Subject<ChecklistItem['id']>();
  checklistRemoved$ = new Subject<ChecklistItem['id']>();
  private error$ = new Subject<string>();
  private checklistsLoaded$ = this.checklistItemStorage.loadChecklistItems().pipe(catchError((err) => {
    this.error$.next(err);
    return EMPTY;
  }));


  constructor() {
    const nextState$ = merge(
      this.checklistsLoaded$.pipe(
        map(checklist => ({ checklist, loaded: true })),
      ),
      this.error$.pipe(map((error) => ({ error })))
    )

    connect(this.state)
      .with(nextState$)
      .with(this.add$, (state, itemToAdd) => ({
        ...state,
        checklistItems: [...state.checklistItems, {
          ...itemToAdd.item,
          id: Date.now().toString(),
          checklistId: itemToAdd.checklistId,
          checked: false,
        }],
      }))
      .with(this.edit$, (state, itemToEdit) => ({
        ...state,
        checklistItems: state.checklistItems.map(
          (item) => (item.id === itemToEdit.id ? { ...item, ...itemToEdit.data } : item)
        )
      }))
      .with(this.remove$, (state, id) => ({
        ...state,
        checklistItems: state.checklistItems.filter(item => item.id !== id),
      }))
      .with(this.toggle$, (state, id) => ({
        ...state,
        checklistItems: state.checklistItems.map(
          item => item.id === id ? ({ ...item, checked: !item.checked }) : item
        )
      }))
      .with(this.reset$, (state, checklistId) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
      .with(this.checklistRemoved$, (state, checklistId) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          item => item.checklistId === item.checklistId,
        )
      }));

    effect(() => {
      if (this.loaded()) {
        this.checklistItemStorage.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
