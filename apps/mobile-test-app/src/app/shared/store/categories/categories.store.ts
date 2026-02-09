import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';

import { initialCategoriesState } from './categories.state';
import { withBaseStore } from '../../models/store/base.store';
import { CATEGORIES_STORE_ACTIONS } from '../constants/actions';
import { PerformanceType } from '../../models/performance-type/performance-type';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';
import { PerformanceTypesService } from '../../services/performance-types.service/performance-types.service';
import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';

const categoriesStoreFeatureKey = 'CategoriesFeatureStore';

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withDevtools(categoriesStoreFeatureKey),
  withBaseStore(),
  withState(initialCategoriesState),

  withMethods((store) => {
    const globalSpinnerService = inject(GlobalSpinnerService);
    const performanceTypesService = inject(PerformanceTypesService);

    const getCategories = rxMethod<void>(
      pipe(
        tap((): void => {
          if (store.categories().length === 0 && !store.categoriesPending()) {
            globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: true, message: 'Loading categories...' });
            updateState(store, CATEGORIES_STORE_ACTIONS.getCategories, { categoriesPending: true });
          }
        }),
        switchMap(() => {
          if (store.categories().length > 0 || !store.categoriesPending()) {
            return EMPTY;
          }
          return performanceTypesService.getPerformanceTypes$()
            .pipe(
              finalize(()=> globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: false, message: 'Loading categories...' })),
              tapResponse({
                next: (res: PerformanceType[]): void => {
                  updateState(
                    store,
                    CATEGORIES_STORE_ACTIONS.getCategoriesSuccess,
                    { categories: res, categoriesPending: false },
                  );
                },
                error: (error: never): void => {
                  globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: false, message: 'Loading categories...' });
                  updateState(store, CATEGORIES_STORE_ACTIONS.getCategoriesFailure, { error, categoriesPending: false });
                },
              }),
            );
        }),
      ),
    );

    return {
      getCategories,
    };
  }),
);
