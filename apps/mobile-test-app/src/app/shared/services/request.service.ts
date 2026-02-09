/* eslint-disable @typescript-eslint/no-empty-object-type,@typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly http = inject(HttpClient);

  public get(url: string, options?: {}): any {
    return options ? this.http.get(url, options) : this.http.get(url);
  }

  public delete(url: string, options?: {}): any {
    return options ? this.http.delete(url, options) : this.http.delete(url);
  }

  public post(url: string, body: {} = {}, options?: {}): any {
    return this.http.post(url, body, options);
  }

  public put(url: string, body: {} = {}, options?: {}): any {
    return this.http.put(url, body, options);
  }

  public setRequestParams<T>(params: T): { params: HttpParams } {
    let httpParams = new HttpParams();

    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        const value = (params as any)[key];

        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
          if (value.length === 0) return; // <- skip empty arrays
          httpParams = httpParams.set(key, value.map(v => String(v)).join(','));
        } else if (value instanceof Date) {
          httpParams = httpParams.set(key, value.toISOString());
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return { params: httpParams };
  }
}
