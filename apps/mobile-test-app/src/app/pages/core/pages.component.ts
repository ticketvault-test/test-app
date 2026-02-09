import { IonContent, IonRefresher, IonRefresherContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, AfterViewInit, OnDestroy, inject, OnInit } from '@angular/core';

import { AuthenticationService } from '@mobile-test-app/services/authentication.service/authentication.service';
import { MonitoringActivityService } from '@mobile-test-app/services/monitoring-activity.service/monitoring-activity.service';

@Component({
  standalone: true,
  selector: 'pages',
  templateUrl: './pages.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonRouterOutlet, IonRefresher, IonRefresherContent, IonContent],
})
export class PagesComponent implements AfterViewInit, OnDestroy, OnInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly monitoringActivityService = inject(MonitoringActivityService);

  public disableGlobalRefresher = false;

  private touchStartY = 0;
  private readonly HEADER_THRESHOLD = 120; // head touch area
  private readonly boundTouchStart: (event: TouchEvent) => void;

  constructor() {
    this.boundTouchStart = this.onTouchStart.bind(this);
  }

  public ngOnInit(): void {
    this.monitoringActivityService.start(() => location.reload());
    this.authenticationService.startAutoRefresh();
  }

  public ngAfterViewInit(): void {
    document.addEventListener('touchstart', this.boundTouchStart, { passive: true });
  }

  public ngOnDestroy(): void {
    this.monitoringActivityService.stop();
    this.authenticationService.stopAutoRefresh();
    document.removeEventListener('touchstart', this.boundTouchStart);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async handleRefresh(event: any): Promise<void> {
    window.location.reload();

    event.target.complete();
  }

  private onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;

    const shouldEnable = this.touchStartY <= this.HEADER_THRESHOLD;

    if (this.disableGlobalRefresher === shouldEnable) {
      this.disableGlobalRefresher = !shouldEnable;
      this.changeDetectorRef.markForCheck();
    }
  }
}
