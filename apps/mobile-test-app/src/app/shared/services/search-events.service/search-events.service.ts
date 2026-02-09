import { Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { UrlService } from '../url.service/url.service';
import { ErrorHandlingService } from '../error-handling.service/error-handling.service';
import { SearchEvent } from '@mobile-test-app/models/search-events/search-event';

@Injectable({ providedIn: 'root' })
export class SearchEventsService {
  private readonly urlService = inject(UrlService);
  private readonly errorHandlingService = inject(ErrorHandlingService);

  public getSearchEvent$(): Observable<SearchEvent[]> {
    return of();
  }
}
