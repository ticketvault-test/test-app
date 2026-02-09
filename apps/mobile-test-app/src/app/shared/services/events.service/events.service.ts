import { catchError, map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { UrlService } from '../url.service/url.service';
import { ErrorHandlingService } from '../error-handling.service/error-handling.service';
import { PRICING_MODE_ID } from '@mobile-test-app/constants/pricing-mode/pricing-mode';
import { getUserUILocaleTimeZone } from '@mobile-test-app/helpers/date-helpers/date.helpers';
import { EventItem, EventItemAPI, EventsFilters, EventsFiltersAPI } from '../../models/events/events';
import { ExternalListingResponse, ExternalListingResponseAPI } from '@mobile-test-app/models/external-listing/external-listing';
import { EventTicketGroup, EventTicketGroupAPI, EventTicketGroupResponse, EventTicketGroupResponseAPI, TicketGroupNetworkTypes, TicketGroupNetworkTypesAPI, TicketGroupPriceModelAPI } from '../../models/events/event-ticket-group';
import { RequestService } from '@mobile-test-app/services/request.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly urlService = inject(UrlService);
  private readonly errorHandlingService = inject(ErrorHandlingService);
  private readonly requestService = inject(RequestService);

  public getEventInfo$(eventId: number): Observable<EventItem> {
    return this.requestService.get(this.urlService.getEventInfoURL(eventId))
      .pipe(
        map((res: EventItemAPI): EventItem => EventItem.getDataFromAPI(res)),
        catchError(err => this.errorHandlingService.handleError(err)),
      );
  }

  public getEvents$(filters: EventsFilters): Observable<EventItem[]> {
    return this.requestService.get(this.urlService.getEventsURL(),
      this.requestService.setRequestParams<EventsFiltersAPI>(EventsFiltersAPI.prepareDataForAPI(filters)))
      .pipe(
        map((res: EventItemAPI[]): EventItem[] => res.map(it => EventItem.getDataFromAPI(it))),
        catchError(err => this.errorHandlingService.handleError(err)),
      );
  }

  public saveNetworksBroadcast$(data: TicketGroupNetworkTypes): Observable<EventTicketGroup[]> {
    return this.requestService.post(this.urlService.getNetworksUrl(), TicketGroupNetworkTypesAPI.prepareDataForAPI(data)).pipe(
      map((res: EventTicketGroupAPI[]): EventTicketGroup[] => res.map(it => EventTicketGroup.getDataFromAPI(it))),
      catchError(err => this.errorHandlingService.handleError(err)),
    );
  }

  public saveBulkPrice$(eventTicketGroups: EventTicketGroup[]): Observable<EventTicketGroup[]> {
    return this.requestService.post(this.urlService.getUpdateBulkPriceUrl(),
      eventTicketGroups.map(eventTicketGroup => TicketGroupPriceModelAPI.prepareDataForAPI(eventTicketGroup)))
      .pipe(
        map((res: EventTicketGroupAPI[]): EventTicketGroup[] => res.map(it => EventTicketGroup.getDataFromAPI(it))),
        catchError(err => this.errorHandlingService.handleError(err)),
      );
  }

  public updateBlock$(eventId: number, eventTicketGroups?: EventTicketGroup[]): Observable<EventTicketGroup[]> {
    return this.requestService.post(this.urlService.getUpdateBlockUrl(eventId),
      eventTicketGroups.map(eventTicketGroup => EventTicketGroupResponseAPI.prepareDataForAPI(eventTicketGroup)))
      .pipe(
        map((res: EventTicketGroupResponseAPI[]): EventTicketGroupResponse[] => res.map(it => EventTicketGroupResponse.getDataFromAPI(it))),
        map((res: EventTicketGroupResponse[]) => res.reduce((acc: EventTicketGroup[], cur) => [...acc, ...cur.ticketGroups], [])),
        catchError(err => this.errorHandlingService.handleError(err)),
      );
  }

  public getEventExternalListings$(eventId: number): Observable<ExternalListingResponse> {
    return this.requestService.get(this.urlService.getEventExternalListingURL(),
      this.requestService.setRequestParams({ EventID: eventId, UiTimeZone: getUserUILocaleTimeZone(), PricingMode: PRICING_MODE_ID.seatGeek }))
      .pipe(
        map((res: ExternalListingResponseAPI): ExternalListingResponse => ExternalListingResponse.getDataFromAPI(res)),
        catchError(err => this.errorHandlingService.handleError(err)));
  }

  public getEventTicketGroupsResponse$(eventId: number): Observable<EventTicketGroupResponse[]> {
    return this.requestService.get(this.urlService.getEventTicketGroupsURL(eventId)).pipe(
      map((res: EventTicketGroupResponseAPI[]): EventTicketGroupResponse[] =>
        res.map(it => EventTicketGroupResponse.getDataFromAPI(it)),
      ),
      catchError(err => this.errorHandlingService.handleError(err)),
    );
  }
}
