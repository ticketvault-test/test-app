import type { IonInput } from '@ionic/angular';
import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

import { sanitizeSignedDecimal } from '@mobile-test-app/helpers/input-helpers/input.helpers';

@Directive({
  standalone: true,
  selector: 'ion-input[stringNumbersCorrector]',
})
export class StringNumbersCorrectorDirective {
  private readonly host = inject<ElementRef<IonInput>>(ElementRef);

  public allowNegative = input<boolean>(true);
  public fractionDigits = input<number>(2);

  @HostListener('ionInput')
  public onIonInput(): void {
    void this.sanitizeIonValue();
  }

  private async sanitizeIonValue(): Promise<void> {
    const ion = this.host.nativeElement;
    const prev = (ion.value ?? '').toString();
    const next = sanitizeSignedDecimal(prev, { allowNegative: this.allowNegative(), fractionDigits: this.fractionDigits() });

    if (next === prev) return;

    ion.value = next;

    // synchronize shadow input (important for iOS)
    const el = await ion.getInputElement();

    if (el.value !== next) {
      el.value = next;
    }
  }
}

