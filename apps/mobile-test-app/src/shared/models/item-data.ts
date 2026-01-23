export class ItemData {
  id: number;
  name: string;
  code: string;
  description?: string;
  details?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  assignedTo?: string;
  archived: boolean;
  estimateHours?: number;
  progressPercent: number;
  relatedIds?: number[];
}
