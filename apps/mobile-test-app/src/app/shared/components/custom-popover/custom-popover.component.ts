import { ChangeDetectionStrategy, Component, HostListener, inject, input, ViewEncapsulation } from '@angular/core';

import { PopoverService } from '@mobile-test-app/services/popover.service/popover.service';

@Component({
  selector: 'custom-popover',
  templateUrl: './custom-popover.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPopoverComponent {
  private readonly popoverService = inject(PopoverService);

  public message = input<string>();

  @HostListener('document:click')
  @HostListener('document:touchstart')
  public onDocumentInteraction(): void {
    this.popoverService.closePopovers();
  }
}
