import { Observable, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';

import { AppSettings } from '../../models/app-settings/app-settings';
import { STORAGE_KEYS } from '@mobile-test-app/constants/storage/storage';
import appSettingsData from '../../../../assets/app-settings/app-settings.json';

@Injectable({ providedIn: 'root' })
export class AppSettingsService {

  private httpClient: HttpClient;
  private appSettings: AppSettings = appSettingsData as AppSettings;

  private readonly CONFIG_URL = 'assets/app-settings/app-settings.json';

  constructor(
    private readonly handler: HttpBackend,
  ) {
    this.httpClient = new HttpClient(handler);
  }

  public getAppSettings$(): Observable<AppSettings> {
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    const versionedUrl = `${this.CONFIG_URL}?dateNow=${Date.now()}`;

    return this.httpClient
      .get<AppSettings>(versionedUrl, { headers })
      .pipe(tap(settings => this.appSettings = settings));
  }

  public getAppSettings(): AppSettings {
    return this.appSettings;
  }

  public getStoredVersion(): string | null {
    return null;
  }

  public setStoredVersion(currentAppVersion: string): void {
    // this.storageService.set(STORAGE_KEYS.appVersion, currentAppVersion);
  }
}
