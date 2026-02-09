import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, ViewEncapsulation } from '@angular/core';

import { PAGE_URL } from '../../../shared/constants/pages/pages';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { AuthenticationService } from '../../../shared/services/authentication.service/authentication.service';
import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';

@Component({
  standalone: true,
  selector: 'forgot-password',
  templateUrl: 'forgot-password.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ForgotPasswordFormComponent, RouterLink],
})
export class ForgotPasswordComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly globalSpinnerService = inject(GlobalSpinnerService);

  protected readonly PAGE_URL = PAGE_URL;

  public isPasswordSend = signal<boolean>(false);

  public forgotPassword(userName: string): void {
    this.globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: true });

    this.authenticationService.forgotPasswordRequest$(userName)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isPasswordSend.set(true);
          this.globalSpinnerService.setGlobalSpinnerState({ ...new GlobalSpinner(), loading: false });
        }),
      )
      .subscribe();
  }
}
