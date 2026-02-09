import { FormsModule } from '@angular/forms';
import { IonButton, IonInput } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, output, ViewEncapsulation } from '@angular/core';

import { FORM_FIELD } from './constants/form-fields';
import { isFormValid } from '@mobile-test-app/helpers/form-helpers/form.helpers';
import { INPUT_VALIDATION } from '@mobile-test-app/constants/validation/validation';

@Component({
  standalone: true,
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonInput,
    IonButton,
    FormsModule,
  ],
})
export class ForgotPasswordFormComponent {
  public forgotPassword = output<string>();

  protected readonly FORM_FIELD = FORM_FIELD;
  protected readonly isFormValid = isFormValid;
  protected readonly INPUT_VALIDATION = INPUT_VALIDATION;
}
