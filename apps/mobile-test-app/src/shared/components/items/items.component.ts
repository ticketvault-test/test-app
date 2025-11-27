import { CommonModule } from '@angular/common';
import {
  IonicModule,
  ActionSheetController,
  IonItemSliding,
  NavController,
} from '@ionic/angular';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { ItemData } from '../../models/item-data';
import { ItemsService } from '../../services/mock-generator.service';

@Component({
  standalone: true,
  selector: 'tv-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  imports: [IonicModule, CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  public readonly itemsService = inject(ItemsService);
  private readonly navController = inject(NavController);
  private readonly actionSheetCtrl = inject(ActionSheetController);

  public async openItem(item: ItemData): Promise<void> {
    this.navController.navigateForward('/items/' + item.id);
  }

  // Открытие конкретного айтема по свайпу влево
  public async onSwipeOpen(item: ItemData, sliding?: IonItemSliding): Promise<void> {
    if (sliding) await sliding.close();
    this.navController.navigateForward('/items/' + item.id);
  }

  public async confirmDelete(item: ItemData, sliding?: IonItemSliding): Promise<void> {
    if (sliding) await sliding.close();

    const sheet = await this.actionSheetCtrl.create({
      header: `delete "${item.name}"?`,
      buttons: [
        { text: 'delete', role: 'destructive' },
        { text: 'cancel', role: 'cancel' },
      ],
    });
    await sheet.present();

    const { role } = await sheet.onWillDismiss();
    if (role === 'destructive') this.itemsService.delete(item.id);
  }

  public archive(item: ItemData, sliding?: IonItemSliding): void {
    if (sliding) sliding.close();
    this.itemsService.archive(item);
  }

  public handleRefresh(ev: CustomEvent): void {
    this.itemsService.reload();
    setTimeout(() => (ev.target as HTMLIonRefresherElement).complete(), 500);
  }
}
