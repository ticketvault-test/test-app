import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController, GestureController, IonContent, ModalOptions } from '@ionic/angular';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject, AfterViewInit, OnDestroy, viewChild } from '@angular/core';

import { ItemsService } from '../../../services/mock-generator.service';
import { EditPriceModalComponent } from '../components/edit-price-modal/edit-price-modal.component';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-item-detail',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  imports: [IonicModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ItemDetailsComponent implements AfterViewInit, OnDestroy {
  public readonly navController = inject(NavController);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly modalController = inject(ModalController);
  private readonly itemsService = inject(ItemsService);
  private readonly gestureCtrl = inject(GestureController);

  public ionContent = viewChild(IonContent);
  public item = this.itemsService.getById(Number(this.activatedRoute.snapshot.paramMap.get('id')));

  private swipeGesture?: ReturnType<GestureController['create']>;


  public goBack(): void {
    this.navController.back();
  }

  async ngAfterViewInit(): Promise<void> {
    const scrollEl = await this.ionContent().getScrollElement();
    this.swipeGesture = this.gestureCtrl.create({
      el: scrollEl,
      gestureName: 'swipe-left-to-back',
      direction: 'x',
      threshold: 15,
      onEnd: ev => {
        if (ev.deltaX > 80 && Math.abs(ev.velocityX) > 0.2) {
          this.goBack();
        }
      },
    });
    this.swipeGesture.enable(true);
  }

  ngOnDestroy(): void {
    this.swipeGesture?.destroy();
    this.swipeGesture = undefined;
  }


  public async editAdjustPrice(): Promise<void> {
    const modal = await this.modalController.create(this.prepareEditPriceModalComponent());

    await modal.present();

    const result = await modal.onDidDismiss();

    if (!result.data) return;

  }

  private prepareEditPriceModalComponent(): ModalOptions {
    return {
      component: EditPriceModalComponent,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'custom-modal-auto-height',
      handle: false,
    };
  }
}
