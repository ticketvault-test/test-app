import { addIcons } from 'ionicons';
import { RouterOutlet } from '@angular/router';
import type { ModalOptions } from '@ionic/core';
import { downloadOutline } from 'ionicons/icons';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonRefresher, IonRefresherContent, ModalController } from '@ionic/angular/standalone';

import { TvLogoComponent } from '../../shared/components/tv-logo/tv-logo.component';
import { HowToInstallModalComponent } from './modals/how-to-install/how-to-install-modal.component';

@Component({
  standalone: true,
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, IonIcon, TvLogoComponent, IonButton, IonContent, IonRefresher, IonRefresherContent],
})
export class AuthenticationComponent {
  private readonly modalController = inject(ModalController);

  constructor() {
    addIcons({ downloadOutline });
  }

  public async openHowToInstallModal(): Promise<void> {
    const modal = await this.modalController.create(this.prepareHowToInstallModalComponent());

    await modal.present();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async handleRefresh(event: any): Promise<void> {
    console.log('handleRefresh auth');
    window.location.reload();

    event.target.complete();
  }

  private prepareHowToInstallModalComponent(): ModalOptions {
    return {
      component: HowToInstallModalComponent,
      cssClass: 'custom-modal',
    };
  }
}
