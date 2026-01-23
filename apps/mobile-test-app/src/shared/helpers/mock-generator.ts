import { ItemData } from '../models/item-data';

export function generateMock(count = 500): ItemData[] {

  const items: ItemData[] = [];
  for (let i = 1; i <= count; i++) {
    const created = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30);
    const updated = new Date(created.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 7);
    items.push({
      id: i,
      name: `Item #${i}`,
      code: `ITM-${String(i).padStart(4, '0')}`,
      description: Math.random() > 0.4 ? `Info ${i}` : undefined,
      details: Math.random() > 0.6 ? `Details ${i}` : undefined,
      tags: Array.from({ length: Math.floor(Math.random() * 4) }, (_, k) => `tag${k + 1}`),
      createdAt: created,
      updatedAt: updated,
      owner: ['artem', 'system', 'bot', 'tester'][Math.floor(Math.random() * 4)],
      assignedTo: Math.random() > 0.5 ? ['alex', 'kate', 'john'][Math.floor(Math.random() * 3)] : undefined,
      archived: false,
      estimateHours: Math.random() > 0.5 ? Math.round(Math.random() * 40) : undefined,
      progressPercent: Math.round(Math.random() * 100),
      relatedIds: Math.random() > 0.7 ? [Math.ceil(Math.random() * count), Math.ceil(Math.random() * count)] : undefined,
    });
  }
  return items;
}
