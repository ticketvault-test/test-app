import { Injectable, signal } from '@angular/core';

import { ItemData } from '../models/item-data';
import { generateMock } from '../helpers/mock-generator';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  public items = signal<ItemData[]>(generateMock());

  reload(): void {
    this.items.set(generateMock());
  }

  getById(id: number): ItemData | undefined {
    return this.items().find(i => i.id === id);
  }

  archive(item: ItemData): void {
    this.items.update(list =>
      list.map(i => i.id === item.id ? { ...i, archived: true, status: 'archived' } : i),
    );
  }

  delete(id: number): void {
    this.items.update(list => list.filter(i => i.id !== id));
  }
}
