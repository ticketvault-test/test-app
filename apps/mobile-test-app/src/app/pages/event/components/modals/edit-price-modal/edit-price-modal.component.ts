import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { FormsModule, NgForm } from '@angular/forms';
import { IonButton, IonInput, IonLabel, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, signal } from '@angular/core';

import { FORM_FIELD } from './constants/form-field';
import { INPUT_VALIDATION } from '@mobile-test-app/constants/validation/validation';
import { EventTicketGroup } from '@mobile-test-app/models/events/event-ticket-group';
import { sanitizeSignedDecimal } from '@mobile-test-app/helpers/input-helpers/input.helpers';
import { toFixedNumber } from '@mobile-test-app/helpers/format-number-helpers/format-number.helpers';
import { StringNumbersCorrectorDirective } from '@mobile-test-app/directives/string-number-corrector/string-number-corrector.directive';

@Component({
  standalone: true,
  selector: 'edit-price-modal',
  templateUrl: './edit-price-modal.component.html',
  styleUrls: ['./edit-price-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonLabel,
    IonInput,
    IonButton,
    FormsModule,
    StringNumbersCorrectorDirective,
  ],
})
export class EditPriceModalComponent {
  private readonly modalController = inject(ModalController);

  public eventTicketGroups = input<EventTicketGroup[]>();

  public isPercentage = signal<boolean>(false);

  protected readonly FORM_FIELD = FORM_FIELD;
  protected readonly INPUT_VALIDATION = INPUT_VALIDATION;
  protected readonly sanitizeSignedDecimal = sanitizeSignedDecimal;

  constructor() {
    addIcons({ closeOutline });
  }

  public applyForm(form: NgForm): void {
    let hasChanges = false;
    let eventTicketGroups = this.eventTicketGroups();
    const adjustPriceValue = toFixedNumber(parseFloat(form.value[FORM_FIELD.adjustPrice]));
    const price = toFixedNumber(parseFloat(form.value[FORM_FIELD.setPriceTo]));

    eventTicketGroups = eventTicketGroups?.map(group => {
      let newPriceValue: number;

      if (adjustPriceValue && !price) {
        const adjustment = this.isPercentage()
          ? Math.round((adjustPriceValue * group.marketPrice) / 100 * 100) / 100
          : adjustPriceValue;

        newPriceValue = group.marketPrice + (adjustment ? adjustment : 0);
        newPriceValue = toFixedNumber(newPriceValue);
      } else {
        newPriceValue = price;
      }

      const shouldUpdate = newPriceValue > 0 && group.marketPrice !== newPriceValue;

      if (shouldUpdate) {
        hasChanges = true;
      }

      return {
        ...group,
        marketPrice: shouldUpdate ? newPriceValue : group.marketPrice,
      };
    });

    this.modalController.dismiss(hasChanges ? eventTicketGroups : null);
  }
}
