import { map, filter } from 'rxjs';
import { addIcons } from 'ionicons';
import { ActivatedRoute } from '@angular/router';
import { arrowBackOutline } from 'ionicons/icons';
import { IonButton, IonHeader, IonIcon, NavController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';

import { EventInfoHeaderComponent } from '../event-info-header/event-info-header.component';
import { QUERY_PARAMS_KEYS } from '@mobile-test-app/constants/query-params/query-params';

@Component({
  standalone: true,
  selector: 'block-details',
  templateUrl: './block-details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonHeader,
    IonButton,
    EventInfoHeaderComponent,
  ],
})
export class BlockDetailsComponent implements OnInit {
  public readonly navController = inject(NavController);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get(QUERY_PARAMS_KEYS.blockId)),
        filter((id): id is string => !!id),
      )
      .subscribe(blockId => {
        console.log('block ID:', blockId);
      });
  }
}
