import { FormsModule } from '@angular/forms';
import { IonButton, IonCheckbox, IonContent, IonHeader, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, signal, effect, untracked, inject, OnInit } from '@angular/core';

import { CategoriesStore } from '../../../../../../shared/store/categories/categories.store';
import { PerformanceType } from '@mobile-test-app/models/performance-type/performance-type';

@Component({
  selector: 'select-categories-modal',
  templateUrl: './select-categories-modal.component.html',
  styleUrls: ['./select-categories-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    IonHeader,
    FormsModule,
    IonCheckbox,
    IonContent,
  ],
})
export class SelectCategoriesModalComponent implements OnInit {
  public readonly modalController = inject(ModalController);
  public readonly categoriesStore = inject(CategoriesStore);

  public selectedCategoryIds = input<number[]>([]);

  public allSelected = signal<boolean>(false);
  public categories = signal<PerformanceType[]>([]);

  constructor() {
    effect(() => {
      const storeCategories = this.categoriesStore.categories();

      if (storeCategories && storeCategories.length > 0) {
        untracked(() => {
          const selectedIds = this.selectedCategoryIds() || [];
          const categoriesWithSelection = storeCategories.map(category => ({
            ...category,
            isChecked: selectedIds.includes(category.id),
          }));

          this.categories.set(categoriesWithSelection);
          this.updateAllSelectedState();
        });
      }
    });
  }

  public ngOnInit(): void {
    this.categoriesStore.getCategories();
  }

  public toggleCategory(categoryId: number, isChecked: boolean): void {
    this.categories.update(categories =>
      categories.map(cat => cat.id === categoryId ? { ...cat, isChecked } : cat),
    );

    this.updateAllSelectedState();
  }

  public toggleSelectAll(): void {
    const newState = !this.allSelected();

    this.allSelected.set(newState);
    this.categories.update(categories =>
      categories.map(cat => ({ ...cat, isChecked: newState })),
    );
  }

  public save(): void {
    const selectedIds = this.categories()
      .filter(cat => cat.isChecked)
      .map(cat => cat.id);

    this.modalController.dismiss(selectedIds);
  }

  private updateAllSelectedState(): void {
    const allChecked = this.categories().length > 0 && this.categories().every(cat => cat.isChecked);

    this.allSelected.set(allChecked);
  }
}
