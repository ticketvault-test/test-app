import { addIcons } from 'ionicons';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { eye, lockClosed, personCircle, arrowUpCircle } from 'ionicons/icons';
import { IonButton, IonIcon, IonInput, IonLabel } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, output, ViewEncapsulation } from '@angular/core';

import { FORM_FIELD } from './constants/form-fields';
import { PAGE_URL } from '@mobile-test-app/constants/pages/pages';
import { LoginModel } from '@mobile-test-app/models/login-model/login-model';
import { INPUT_VALIDATION } from '@mobile-test-app/constants/validation/validation';
import { isFormValid, triggerNgModelValidation } from '@mobile-test-app/helpers/form-helpers/form.helpers';

@Component({
  standalone: true,
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonLabel,
    IonInput,
    IonButton,
    RouterLink,
    FormsModule,
  ],
})
export class LoginFormComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public login = output<LoginModel>();
  public resetCustomError = output<void>();

  protected readonly PAGE_URL = PAGE_URL;
  protected readonly FORM_FIELD = FORM_FIELD;
  protected readonly INPUT_VALIDATION = INPUT_VALIDATION;

  constructor() {
    addIcons({ eye, lockClosed, personCircle, arrowUpCircle });
  }

  protected onFieldBlur(ngModel: NgModel): void {
    triggerNgModelValidation(ngModel);
    this.changeDetectorRef.detectChanges();
  }

  protected validateAndSubmit(form: NgForm): void {
    const valid = isFormValid(form);

    if (valid) {
      this.login.emit(form.value);
    } else {
      this.changeDetectorRef.detectChanges();
    }
  }
}
