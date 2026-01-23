import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { FormsModule, NgForm } from '@angular/forms';
import { IonButton, IonInput, IonLabel, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, signal } from '@angular/core';

import { FORM_FIELD } from './constants/form-field';
import { INPUT_VALIDATION } from '../../../../constants/validation/validation';
import { onlyNumberInput } from '../../../../helpers/input-helpers/input.helpers';

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
  ],
})
export class EditPriceModalComponent {
  private readonly modalController = inject(ModalController);

  public eventTicketGroups = input<any[]>();

  public isPercentage = signal<boolean>(false);

  public adjustPrice: string = '';
  public newPrice: string = '';

  protected readonly FORM_FIELD = FORM_FIELD;
  protected readonly INPUT_VALIDATION = INPUT_VALIDATION;

  constructor() {
    addIcons({ closeOutline });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onAdjustPriceInput(event: any): void {
    this.adjustPrice = onlyNumberInput(event.target.value, true);
    event.target.value = this.adjustPrice;

    if (this.adjustPrice) this.newPrice = '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onAmountInput(event: any): void {
    this.newPrice = onlyNumberInput(event.target.value);
    event.target.value = this.newPrice;

    if (this.newPrice) this.adjustPrice = '';
  }

  public applyForm(form: NgForm): void {
    let hasChanges = false;
    let eventTicketGroups = this.eventTicketGroups();
    const adjustPriceValue = parseFloat(this.adjustPrice);
    const price = parseFloat(this.newPrice);

    eventTicketGroups = eventTicketGroups?.map(group => {
      let newPriceValue: number;

      if (adjustPriceValue) {
        const adjustment = this.isPercentage()
          ? (adjustPriceValue * group.marketPrice) / 100
          : adjustPriceValue;

        newPriceValue = group.marketPrice + (adjustment ? adjustment : 0);
      } else {
        newPriceValue = price;
      }

      const shouldUpdate = newPriceValue > 0 && group.floor !== newPriceValue;

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
