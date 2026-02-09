import { inject, Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';

import { CustomPopoverComponent } from '../../components/custom-popover/custom-popover.component';

@Injectable({ providedIn: 'root' })
export class PopoverService {
  private readonly popoverController = inject(PopoverController);

  public customPopoverRef: HTMLIonPopoverElement;

  public async closePopovers(): Promise<void> {
    let popover = await this.popoverController.getTop();

    while (popover) {
      await popover.dismiss();

      popover = await this.popoverController.getTop();
    }
  }

  public async openPopover(event: Event, message: string): Promise<void> {
    if (this.customPopoverRef) await this.customPopoverRef.dismiss();

    const popover = await this.popoverController.create({
      event,
      component: CustomPopoverComponent,
      reference: 'trigger',
      showBackdrop: false, // important for the click to pop up
      backdropDismiss: false, // important for the click to pop up
      cssClass: 'custom-popover__default',
      componentProps: { message },
    });

    await popover.present();

    this.customPopoverRef = popover;
  }
}
