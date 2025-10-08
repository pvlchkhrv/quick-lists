import { Component, Input } from '@angular/core';
import { ChecklistItem } from '../../shared/interfaces/check-list-item';

@Component({
  selector: 'app-checklist-item-list',
  template: `
    <section>
      <ul>
        @for(item of checklistItems; track item.id) {
        <li>
          <div>
            {{ item.title }}
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
}
