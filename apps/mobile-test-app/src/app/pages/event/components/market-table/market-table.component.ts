import { addIcons } from 'ionicons';
import { closeOutline, filterOutline } from 'ionicons/icons';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, inject, input, signal, ViewEncapsulation, viewChild, effect, untracked } from '@angular/core';
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonList, IonPopover, IonRow, ModalController } from '@ionic/angular/standalone';

import { MARKET_TABLE_FIELD } from './constants/field';
import { trackBy } from '@mobile-test-app/helpers/track-by/track-by.helper';
import { SORT_ORDER } from '@mobile-test-app/constants/sort-order/sort-order';
import { ExternalListing } from '@mobile-test-app/models/external-listing/external-listing';

@Component({
  standalone: true,
  selector: 'market-table',
  templateUrl: './market-table.component.html',
  styleUrls: ['./market-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonCol,
    IonRow,
    IonIcon,
    IonItem,
    IonList,
    IonGrid,
    IonButton,
    IonContent,
    IonPopover,
    ScrollingModule,
  ],
})
export class MarketTableComponent {
  public readonly modalController = inject(ModalController);

  private viewport = viewChild(CdkVirtualScrollViewport);

  public externalEventListings = input<ExternalListing[]>();

  public sortedExternalEventListings = signal<ExternalListing[]>([]);
  public showSortMenu = signal<boolean>(false);
  public currentSortField = signal<MARKET_TABLE_FIELD>(null);
  public currentSortOrder = signal<SORT_ORDER>(SORT_ORDER.asc);

  protected readonly MARKET_TABLE_FIELD = MARKET_TABLE_FIELD;
  protected readonly SORT_ORDER = SORT_ORDER;

  public readonly ITEM_HEIGHT = 56;
  public readonly trackBy = trackBy;

  constructor() {
    addIcons({ closeOutline, filterOutline });

    effect(() => untracked(() => {
      if (!this.externalEventListings()) return;

      this.sortedExternalEventListings.set([...this.externalEventListings()]);
    }));
    effect(() => {
      this.sortedExternalEventListings();
      setTimeout(() => {
        this.viewport()?.checkViewportSize();
      }, 100);
    });
  }

  public sortBy(field: MARKET_TABLE_FIELD): void {
    const currentField = this.currentSortField();
    const currentOrder = this.currentSortOrder();

    if (currentField === field) {
      const newOrder = currentOrder === SORT_ORDER.asc ? SORT_ORDER.desc : SORT_ORDER.asc;

      this.currentSortOrder.set(newOrder);
    } else {
      this.currentSortField.set(field);
      this.currentSortOrder.set(SORT_ORDER.asc);
    }

    this.applySorting(field);
    this.showSortMenu.set(false);
  }

  private applySorting(field: string): void {
    const order = this.currentSortOrder();
    const sortedListings = [... this.sortedExternalEventListings()].sort((a, b) => {
      let compareValue = 0;

      switch (field) {
        case MARKET_TABLE_FIELD.section: {
          compareValue = a.sectionName.localeCompare(b.sectionName);

          break;
        }
        case MARKET_TABLE_FIELD.price: {
          compareValue = a.price - b.price;

          break;
        }
        case MARKET_TABLE_FIELD.quantity: {
          compareValue = a.quantity - b.quantity;

          break;
        }
        case MARKET_TABLE_FIELD.row: {
          compareValue = a.row.localeCompare(b.row);

          break;
        }
      }

      return order === SORT_ORDER.asc ? compareValue : -compareValue;
    });

    this.sortedExternalEventListings.set(sortedListings);
  }
}
