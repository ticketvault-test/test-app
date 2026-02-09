import { Subscription, filter } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class NavigationOverlaysService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly modalController = inject(ModalController);
  private readonly popoverController = inject(PopoverController);

  private routerEventsSubscription: Subscription;

  public start(): void {
    if (this.routerEventsSubscription) return;

    this.routerEventsSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.dismissAllOverlays());
  }

  public ngOnDestroy(): void {
    this.stop();
  }

  public stop(): void {
    this.routerEventsSubscription?.unsubscribe();
    this.routerEventsSubscription = null;
  }

  private async dismissAllOverlays(): Promise<void> {
    await this.dismissAllModals();
    await this.dismissAllPopovers();
  }

  private async dismissAllModals(): Promise<void> {
    let modal = await this.modalController.getTop();

    while (modal) {
      await modal.dismiss();

      modal = await this.modalController.getTop();
    }
  }

  private async dismissAllPopovers(): Promise<void> {
    let popover = await this.popoverController.getTop();

    while (popover) {
      await popover.dismiss();

      popover = await this.popoverController.getTop();
    }
  }
}
