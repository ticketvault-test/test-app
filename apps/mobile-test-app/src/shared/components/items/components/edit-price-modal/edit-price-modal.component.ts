import { FormsModule } from '@angular/forms';
import { IonButton, IonInput, IonLabel, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';


@Component({
  standalone: true,
  selector: 'edit-price-modal',
  templateUrl: './edit-price-modal.component.html',
  styleUrls: ['./edit-price-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonLabel,
    IonInput,
    IonButton,
    FormsModule,
  ],
})
export class EditPriceModalComponent {
  private readonly modalController = inject(ModalController);
}
