/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { ERRORS } from '@mobile-test-app/constants/errors/errors';
import { HTTP_ERROR_STATUSES } from '../../constants/http-error/http-error';
import { getErrorMessage } from '@mobile-test-app/helpers/error-helpers/error.helper';
import { ConfirmModalData } from '@mobile-test-app/models/confirm-modal-data/confirm-modal-data';
import { ConfirmModalService } from '@mobile-test-app/services/confirm-modal.service/confirm-modal.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  private readonly confirmModalService = inject(ConfirmModalService);

  public handleError(response: any, withoutErrorPopup?: boolean): Observable<unknown> {
    if (response.status !== HTTP_ERROR_STATUSES.unauthorized && !withoutErrorPopup) {
      Promise.resolve().then(() => {
        this.confirmModalService.openConfirmModal({
          ...new ConfirmModalData(),
          message: ErrorHandlingService.getErrorMessage(response, ERRORS.base),
          isOpenCheck: true,
          isCancelBtn: false,
        });
      });
    }

    throw response;
  }

  private static getErrorMessage(response: any, baseMessage: string): string {
    return getErrorMessage(response, baseMessage);
  }
}
