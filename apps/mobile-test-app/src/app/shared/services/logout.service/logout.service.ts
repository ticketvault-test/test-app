import { inject, Injectable } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular/standalone';

import { PAGE_URL } from '@mobile-test-app/constants/pages/pages';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  private readonly navController = inject(NavController);
  // private readonly storageService = inject(StorageService);
  private readonly modalController = inject(ModalController);

  public async logout(): Promise<void> {
    let modal = await this.modalController.getTop();

    while (modal) {
      await modal.dismiss();

      modal = await this.modalController.getTop();
    }

    // LOGOUT_CLEAR_DATA.map(item => this.storageService.remove(item));

    this.navController.navigateRoot([PAGE_URL.login], { replaceUrl: true });
  }
}
