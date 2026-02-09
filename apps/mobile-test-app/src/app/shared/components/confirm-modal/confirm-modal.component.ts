import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { IonButton, IonHeader, IonIcon, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';

import { ConfirmModalData } from '@mobile-test-app/models/confirm-modal-data/confirm-modal-data';
import { CONFIRM_MODAL_CLOSE_TYPES } from '@mobile-test-app/constants/confirm-modal/confirm-modal';

@Component({
  standalone: true,
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonButton,
    IonHeader,
  ],
})
export class ConfirmModalComponent {
  public modalController = inject(ModalController);

  public data = input<ConfirmModalData>();

  protected readonly CONFIRM_MODAL_CLOSE_TYPES = CONFIRM_MODAL_CLOSE_TYPES;

  constructor() {
    addIcons({ closeOutline });
  }
}
