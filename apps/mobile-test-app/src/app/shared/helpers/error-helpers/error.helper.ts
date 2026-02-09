/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorModel } from '@mobile-test-app/models/error/error';

export function getErrorMessage(response: ErrorModel, baseMessage: string): string {
  return response?.errors?.map((it: any) => it.msg)?.join('<br>')
    || response?.error?.detail
    || response?.error?.['']?.[0]
    || response?.error?.errors?.[0]?.msg
    || response?.error?.error_description
    || baseMessage;
}
