import { Component, Input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list',
  template: `
    <ul>
      @for (checklist of checklistList; track checklist.id) {
      <li>
        <a routerLink="/checklist/{{ checklist.id }}">
          {{ checklist.title }}
        </a>
      </li>
      } @empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
  styles: [],
  imports: [RouterLink],
})
export class ChecklistList {
  @Input({ required: true }) checklistList: Checklist[] = [];
}
