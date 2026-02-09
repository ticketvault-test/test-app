import { addIcons } from 'ionicons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { ellipsisHorizontal, informationCircle, location, musicalNotes, time } from 'ionicons/icons';

import { EventItem } from '../../../../shared/models/events/events';
import { PopoverService } from '@mobile-test-app/services/popover.service/popover.service';
import { getEventPopupMessage, getListingPopupMessage, getTotalCostPopupMessage } from '@mobile-test-app/constants/custom-popover/custom-popover';

@Component({
  standalone: true,
  selector: 'events-list-card',
  templateUrl: './events-list-card.component.html',
  styleUrls: ['./events-list-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonButton,
  ],
})
export class EventsListCardComponent {
  public readonly popoverService = inject(PopoverService);

  public event = input<EventItem>();

  protected readonly getListingPopupMessage = getListingPopupMessage;
  protected readonly getTotalCostPopupMessage = getTotalCostPopupMessage;
  protected readonly getEventPopupMessage = getEventPopupMessage;

  constructor() {
    addIcons({ ellipsisHorizontal, informationCircle, time, musicalNotes, location });
  }
}
