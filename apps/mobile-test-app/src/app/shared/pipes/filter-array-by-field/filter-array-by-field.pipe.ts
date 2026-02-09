import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'filterByFieldTruthyOrFalsy',
})
export class FilterByFieldTruthyOrFalsyPipe<T extends Record<string, unknown>> implements PipeTransform {
  public transform(data: T[], field: string, getTruthy: boolean = true): T[] {
    if (!data || !data.length || !field) return data;

    return data.filter(item =>
      getTruthy
        ? !!(item && item[field])
        : !item || !item[field],
    );
  }
}
