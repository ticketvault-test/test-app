import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { ConfirmModalData } from '@mobile-test-app/models/confirm-modal-data/confirm-modal-data';
import { CONFIRM_MODAL_CLOSE_TYPES } from '@mobile-test-app/constants/confirm-modal/confirm-modal';

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
  private readonly modalController = inject(ModalController);

  private isConfirmModalOpen = false;

  public async openConfirmModal(data: ConfirmModalData): Promise<CONFIRM_MODAL_CLOSE_TYPES> {
    if (this.isConfirmModalOpen && data.isOpenCheck) return null;

    this.isConfirmModalOpen = true;

    const modal = await this.modalController.create({
      id: 'confirm-modal',
      component: ConfirmModalComponent,
      cssClass: 'confirm-modal',
      componentProps: { data },
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    this.isConfirmModalOpen = false;

    if (!result.data) return CONFIRM_MODAL_CLOSE_TYPES.backdrop;

    return result.data.closeType;
  }
}
