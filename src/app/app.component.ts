import { ActionSheetController, IonicModule, IonItemSliding } from '@ionic/angular';
import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

export class ItemData {
  id!: number;
  name!: string;
  details?: string;
}

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
  ],
})
export class AppComponent {
  private actionSheetCtrl = inject(ActionSheetController);

  public modalOpen = signal(false);
  public selectedItem = signal<ItemData | null>(null);

  public items = signal<ItemData[]>([
    { id: 1, name: 'One', details: 'Some data here' },
    { id: 2, name: 'Two' },
    { id: 3, name: 'Three' },
    { id: 4, name: 'Four' },
    { id: 5, name: 'Five' },
    { id: 6, name: 'Six' },
    { id: 7, name: 'Seven' },
    { id: 8, name: 'Eight' },
    { id: 9, name: 'Nine' },
    { id: 10, name: 'Ten' },
  ]);

  protected readonly title = signal('Hello TicketVault!');

  public archive(item: ItemData): void {
    console.log('archive item', item);
  }

  public delete(item: ItemData, slide: IonItemSliding): void {
    slide.close();

    this.items.set(this.items().filter(i => i.id !== item.id));
  }

  public openItem(item: ItemData): void {
    this.selectedItem.set(item);
    this.modalOpen.set(true);
  }

  public async requestClose(): Promise<void> {
    const canClose = await this.closeItem();

    if (canClose) this.modalOpen.set(false);
  }

  public async closeItem(): Promise<boolean> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to close?',
      buttons: [
        { text: 'Yes', role: 'confirm' },
        { text: 'No', role: 'cancel' },
      ],
    });

    await actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    const isClose = role === 'confirm';

    if (isClose) this.selectedItem.set(null);

    return isClose;
  }

  public async onModalWillDismiss(ev?: CustomEvent): Promise<void> {
    if (!this.selectedItem()) return;

    const isClose = await this.closeItem();

    !isClose && this.modalOpen.set(true);
  }
}
