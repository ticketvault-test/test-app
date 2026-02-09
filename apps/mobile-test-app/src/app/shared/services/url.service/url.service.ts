import { inject, Injectable } from '@angular/core';

import { AppSettingsService } from '../app-settings.service/app-settings.service';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private readonly appSettingsService = inject(AppSettingsService);

  private readonly apiUrl = this.appSettingsService.getAppSettings().apiUrl;

  public getLoginURL(): string {
    return `${this.apiUrl}/Login`;
  }

  public getRefreshTokenURL(): string {
    return `${this.apiUrl}/RefreshToken`;
  }

  public getForgotPasswordURL(): string {
    return `${this.apiUrl}/ForgotPassword`;
  }

  public getEventsURL(): string {
    return `${this.apiUrl}/events`;
  }

  public getNetworksUrl(): string {
    return `${this.apiUrl}/event/networks`;
  }

  public getUpdateBulkPriceUrl(): string {
    return `${this.apiUrl}/ticketGroup/bulk_price`;
  }

  public getUpdateBlockUrl(eventId: number): string {
    return `${this.apiUrl}/event/${eventId}/blocks`;
  }

  public getEventInfoURL(eventId: number): string {
    return `${this.apiUrl}/event/${eventId}/info`;
  }

  public getEventExternalListingURL(): string {
    return `${this.apiUrl}/event/externallistings`;
  }

  public getEventTicketGroupsURL(eventId: number): string {
    return `${this.apiUrl}/event/${eventId}/ticketgroups`;
  }

  public getEventSalesURL(): string {
    return `${this.apiUrl}/event/sales`;
  }

  public getPerfTypesURL(): string {
    return `${this.apiUrl}/GetPerfTypes`;
  }

  public getSearchEventsURL(): string {
    return `${this.apiUrl}/Event/GetEvents`;
  }
}
