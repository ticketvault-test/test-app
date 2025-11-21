import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject } from '@angular/core';

import { ItemsService } from '../../../services/mock-generator.service';

@Component({
  standalone: true,
  selector: 'app-item-detail',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  imports: [IonicModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ItemDetailsComponent {
  public readonly navController = inject(NavController);
  private readonly activatedRoute = inject(ActivatedRoute);

  private itemsService = inject(ItemsService);

  public item = this.itemsService.getById(Number(this.activatedRoute.snapshot.paramMap.get('id')));

  public goBack(): void {
    this.navController.back();
  }
}
