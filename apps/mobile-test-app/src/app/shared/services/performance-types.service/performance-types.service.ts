import { Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { UrlService } from '../url.service/url.service';
import { ErrorHandlingService } from '../error-handling.service/error-handling.service';
import { PerformanceType } from '../../models/performance-type/performance-type';

@Injectable({ providedIn: 'root' })
export class PerformanceTypesService {
  private readonly urlService = inject(UrlService);
  private readonly errorHandlingService = inject(ErrorHandlingService);

  public getPerformanceTypes$(): Observable<PerformanceType[]> {
    return of();
  }
}
