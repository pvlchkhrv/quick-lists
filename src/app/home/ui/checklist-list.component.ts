import { Component, Input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-list',
  template: `
    <ul>
      @for (checklist of checklistList; track checklist.id) {
      <li>
        {{ checklist.title }}
      </li>
      } @empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
  styles: [],
})
export class ChecklistList {
  @Input({ required: true }) checklistList: Checklist[] = [];
}
