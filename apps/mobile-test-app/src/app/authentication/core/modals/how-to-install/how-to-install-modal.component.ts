import { addIcons } from 'ionicons';
import { KeyValuePipe } from '@angular/common';
import { ellipsisHorizontal, ellipsisVertical, addOutline } from 'ionicons/icons';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';

import { HOW_INSTALL_NAV_MENU } from './constants/how-to-intall';
import { PLATFORM_MODE } from '@mobile-test-app/constants/platform-mode/platform-mode';
import { originalOrder } from '@mobile-test-app/helpers/original-order-helpers/original-order.helpers';

@Component({
  standalone: true,
  selector: 'how-to-install-modal',
  templateUrl: './how-to-install-modal.component.html',
  styleUrls: ['./how-to-install-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonLabel,
    IonHeader,
    IonContent,
    IonSegment,
    KeyValuePipe,
    IonSegmentButton,
  ],
})
export class HowToInstallModalComponent {
  protected readonly originalOrder = originalOrder;
  protected readonly PLATFORM_MODE = PLATFORM_MODE;
  protected readonly HOW_INSTALL_NAV_MENU = HOW_INSTALL_NAV_MENU;

  public activeMenuTab = signal<string | number>(HOW_INSTALL_NAV_MENU.ios);

  constructor() {
    addIcons({ ellipsisHorizontal, ellipsisVertical, addOutline });
  }
}
