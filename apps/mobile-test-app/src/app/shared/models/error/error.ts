/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHeaders } from '@angular/common/http';

export class ErrorModel {
  errors?: any;
  error?: any;
  headers?: HttpHeaders;
  message?: string;
  name?: string;
  ok?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
}
