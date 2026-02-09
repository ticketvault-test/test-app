import { finalize } from 'rxjs';
import { NavController } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, ViewEncapsulation } from '@angular/core';

import { PAGE_URL } from '../../../shared/constants/pages/pages';
import { LoginModel } from '../../../shared/models/login-model/login-model';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginResponse } from '../../../shared/models/login-response/login-response';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';
import { HTTP_ERROR_STATUSES } from '@mobile-test-app/constants/http-error/http-error';
import { AppSettingsService } from '@mobile-test-app/services/app-settings.service/app-settings.service';
import { AuthenticationService } from '../../../shared/services/authentication.service/authentication.service';
import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';

@Component({
  standalone: true,
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent],
})
export class LoginPageComponent {
  public readonly appSettingsService = inject(AppSettingsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly navController = inject(NavController);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly globalSpinnerService = inject(GlobalSpinnerService);

  public customError = signal<string>('');
  public loginAttempts = signal<number>(0);

  public login(loginModel: LoginModel): void {
    this.customError.set('');
    this.loginAttempts.set(0);

    this.globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: true });

    this.authenticationService.login$(loginModel)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: false })),
      )
      .subscribe({
        next: (res: LoginResponse) => {
          if (!res) return;

          this.navController.navigateForward(PAGE_URL.pages);
        },
        error: (errResponse) => {
          if (errResponse?.status !== HTTP_ERROR_STATUSES.notFound) {
            this.customError.set(errResponse?.error || 'Unknown error');
          } else {
            if (errResponse?.error?.startsWith('Failed attempts')) {
              if (errResponse?.error && errResponse.error.match(/\d+/) && errResponse.error.match(/\d+/)?.[0]) {
                const result = errResponse.error.match(/\d+/) ? errResponse.error.match(/\d+/)?.[0] : '0';

                this.loginAttempts.set(parseInt(result ? result : '0'));
              } else {
                this.loginAttempts.set(0);
              }
            } else {
              this.customError.set('Unknown error');
            }
          }
        },
      });
  }
}
