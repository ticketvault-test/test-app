import { IonButton, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';

import { EventItem } from '@mobile-test-app/models/events/events';
import { PopoverService } from '@mobile-test-app/services/popover.service/popover.service';
import { AppSettingsService } from '@mobile-test-app/services/app-settings.service/app-settings.service';
import { getListingPopupMessage, getTotalCostPopupMessage } from '@mobile-test-app/constants/custom-popover/custom-popover';

@Component({
  standalone: true,
  selector: 'event-info-header',
  templateUrl: './event-info-header.component.html',
  styleUrls: ['./event-info-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonButton,
    IonSkeletonText,
  ],
})
export class EventInfoHeaderComponent {
  public readonly popoverService = inject(PopoverService);
  public readonly appSettingsService = inject(AppSettingsService);

  public eventItem = input<EventItem>();

  protected readonly getListingPopupMessage = getListingPopupMessage;
  protected readonly getTotalCostPopupMessage = getTotalCostPopupMessage;
}
