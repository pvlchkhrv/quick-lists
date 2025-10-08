import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistItem, RemoveChecklistItem } from '../../shared/interfaces/check-list-item';

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <section>
      <ul>
        @for (item of checklistItems; track item.id) {
          <li>
            <div>
              @if (item.checked) {
                <span>✅</span>
              }
              {{ item.title }}
            </div>
            <div>
              <button (click)="toggle.emit(item.id)">Toggle</button>
            </div>
          </li>
        } @empty {
          <div>
            <h2>Add an item</h2>
            <p>Click the add button to add your first item to this quick-list</p>
          </div>
        }
      </ul>
    </section>
  `,
  imports: [],
})
export class ChecklistItemList {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<RemoveChecklistItem>();
}
