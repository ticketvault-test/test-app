import { Injectable, signal } from '@angular/core';
import { GlobalSpinner } from '@mobile-test-app/models/global-spinner/global-spinner';

@Injectable({ providedIn: 'root' })
export class GlobalSpinnerService {
  public globalSpinnerState = signal<GlobalSpinner>(new GlobalSpinner());

  public setGlobalSpinnerState(globalSpinner: GlobalSpinner): void {
    this.globalSpinnerState.set(globalSpinner);
  }
}
