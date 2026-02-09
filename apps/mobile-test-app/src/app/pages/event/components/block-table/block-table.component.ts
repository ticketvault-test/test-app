import { addIcons } from 'ionicons';
import { arrowForwardCircle } from 'ionicons/icons';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { IonButton, IonCheckbox, IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output, computed } from '@angular/core';

import { trackBy } from '@mobile-test-app/helpers/track-by/track-by.helper';
import { EventTicketGroup } from '../../../../shared/models/events/event-ticket-group';

@Component({
  standalone: true,
  selector: 'block-table',
  templateUrl: './block-table.component.html',
  styleUrl: './block-table.component.scss',
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
export class BlockTableComponent {
  public blockListings = input<EventTicketGroup[]>([]);
  public allBlocksSelected = input<boolean>(false);
  public maxValueForLastColumn = input<number>();
  public maxSymbolWidthColumn = input<number>();

  public blockSelectionChange = output<{ id: number; checked: boolean }>();
  public adjustFloorsEdit = output<EventTicketGroup>();
  public toggleAllBlockSelection = output<boolean>();
  public blockDetailsNavigate = output<EventTicketGroup>();

  public lastColumnWidth = computed(() => this.maxSymbolWidthColumn() * this.maxValueForLastColumn() + 50);

  public readonly ITEM_HEIGHT = 70;

  protected readonly trackBy = trackBy;

  constructor() {
    addIcons({ arrowForwardCircle });
  }
}
