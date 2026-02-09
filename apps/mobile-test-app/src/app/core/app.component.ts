import { RouterModule } from '@angular/router';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonLoading, IonRouterOutlet } from '@ionic/angular/standalone';

import { GlobalSpinnerService } from '@mobile-test-app/services/global-spinner.service/global-spinner.service';
import { NavigationOverlaysService } from '@mobile-test-app/services/navigation-overlay.service/navigation-overlay.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    IonApp,
    IonLoading,
    IonLoading,
    RouterModule,
    IonRouterOutlet,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly globalSpinnerService = inject(GlobalSpinnerService);
  private readonly navigationOverlaysService = inject(NavigationOverlaysService);

  public ngOnInit(): void {
    this.navigationOverlaysService.start();
  }

  public ngOnDestroy(): void {
    this.navigationOverlaysService.stop();
  }
}
