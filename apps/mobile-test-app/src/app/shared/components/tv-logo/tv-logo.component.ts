import { IonIcon } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tv-logo',
  templateUrl: './tv-logo.component.html',
  styleUrls: ['./tv-logo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class TvLogoComponent {}
