import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { IonButton, IonCheckbox, IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output, computed } from '@angular/core';

import { trackBy } from '@mobile-test-app/helpers/track-by/track-by.helper';
import { EventTicketGroup } from '../../../../shared/models/events/event-ticket-group';

@Component({
  standalone: true,
  selector: 'unblocked-listing-table',
  templateUrl: './unblock-listing-table.component.html',
  styleUrls: ['./unblock-listing-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonButton,
    IonCheckbox,
    ScrollingModule,
    CdkVirtualScrollViewport,
  ],
})
export class UnblockedListingTableComponent {
  public unblockedListings = input<EventTicketGroup[]>([]);
  public allUnblockedSelected = input<boolean>(false);
  public maxValueForLastColumn = input<number>();
  public maxSymbolWidthColumn = input<number>();

  public unblockedSelectionChange = output<{ id: number; checked: boolean }>();
  public toggleAllUnblockedSelection = output<boolean>();
  public editMarketPrice = output<EventTicketGroup>();
  public broadcastEdit = output<EventTicketGroup>();

  public lastColumnWidth = computed(() => this.maxSymbolWidthColumn() * this.maxValueForLastColumn() + 50);

  public readonly ITEM_HEIGHT = 70;

  protected readonly trackBy = trackBy;
}
