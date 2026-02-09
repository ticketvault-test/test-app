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
  selector: 'edit-floors-modal',
  templateUrl: './edit-floors-modal.component.html',
  styleUrls: ['./edit-floors-modal.component.scss'],
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
export class EditFloorsModalComponent {
  private readonly modalController = inject(ModalController);

  public eventTicketGroups = input<EventTicketGroup[]>();

  public isPercentage = signal<boolean>(false);

  protected readonly FORM_FIELD = FORM_FIELD;
  protected readonly INPUT_VALIDATION = INPUT_VALIDATION;
  protected readonly sanitizeSignedDecimal = sanitizeSignedDecimal;

  constructor() {
    addIcons({ closeOutline });
  }

  public isHasComparePrice(): boolean {
    return this.eventTicketGroups().some(eventTicketGroup => eventTicketGroup.cmp1);
  }

  public applyForm(form: NgForm): void {
    let hasChanges = false;
    let eventTicketGroups = this.eventTicketGroups();
    const adjustFloorsValue = toFixedNumber(parseFloat(form.value[FORM_FIELD.adjustFloors]));
    const floors = toFixedNumber(parseFloat(form.value[FORM_FIELD.setFloorsTo]));

    eventTicketGroups = eventTicketGroups?.map(group => {
      let floor: number;

      if (adjustFloorsValue && group?.cmp1 !== null && !floors) {
        const adjustment = this.isPercentage()
          ? Math.round((adjustFloorsValue * group.cmp1) / 100 * 100) / 100
          : adjustFloorsValue;

        floor = group.cmp1 + (adjustment ? adjustment : 0);
        floor = toFixedNumber(floor);
      } else {
        floor = floors;
      }

      const shouldUpdate = floor > 0 && group.floor !== floor;

      if (shouldUpdate) {
        hasChanges = true;
      }

      return {
        ...group,
        floor: shouldUpdate ? floor : group.floor,
      };
    });

    this.modalController.dismiss(hasChanges ? eventTicketGroups : null);
  }
}
