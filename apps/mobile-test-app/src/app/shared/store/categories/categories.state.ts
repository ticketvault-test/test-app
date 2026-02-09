import { PerformanceType } from '../../models/performance-type/performance-type';

export interface CategoriesState {
  categories: PerformanceType[];
  categoriesPending: boolean;
}

export const initialCategoriesState: CategoriesState = {
  categories: [],
  categoriesPending: false,
};
