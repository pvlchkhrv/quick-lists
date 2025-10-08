import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AddChecklist, Checklist, EditChecklist } from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChecklistStorageService } from './checklist-storage.service';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';

export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checklistStorage = inject(ChecklistStorageService);
  private checklistItemService = inject(ChecklistItemService);
  // state
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  // selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);

  // sources
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditChecklist>();
  remove$ = this.checklistItemService.checklistRemoved$;
  private checklistsLoaded$ = this.checklistStorage.loadChecklists();

  constructor() {
    // reducers
    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
        next: (checklists) =>
          this.state.update((state) => ({
            ...state,
            checklists,
            loaded: true
          })),
        error: (err) => this.state.update(state => ({ ...state, error: err }))
      }
    );

    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) => {
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }));
    });

    this.edit$.pipe(takeUntilDestroyed()).subscribe((checklistToEdit) => {
      this.state.update(state => ({
        ...state,
        checklists: state.checklists.map(checklist =>
          checklist.id === checklistToEdit.id ? { ...checklist, ...checklistToEdit.data } : checklist
        )
      }));
      console.log(checklistToEdit)
    });

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) => {
      this.state.update(state => ({
        ...state,
        checklists: state.checklists.filter(checklist => checklist.id !== id)
      }))
    });

    effect(() => {
      if (this.loaded()) {
        this.checklistStorage.saveChecklists(this.checklists());
      }
    });
  }

  private addIdToChecklist(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.checklists().find((checklist) => checklist.id === slug);

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
