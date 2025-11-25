import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, signal, inject, } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonicModule, CommonModule, RouterLink, RouterLinkActive],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public swUpdate = inject(SwUpdate);

  public title = signal<string>('Ticket Vault Mobile Test');

  constructor() {
    this.swUpdate.versionUpdates.subscribe(event => {
      console.log(event);
      if (event.type === 'VERSION_READY') {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}
