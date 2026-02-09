import { FormsModule } from '@angular/forms';
import { IonButton, IonCheckbox, IonHeader, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, signal, effect, untracked, inject } from '@angular/core';

import { EventTicketGroup } from '@mobile-test-app/models/events/event-ticket-group';
import { NetworkTypeModel } from '@mobile-test-app/models/network-type-model/network-type-model';
import { TICKET_NETWORK_TYPE_ARRAY } from '@mobile-test-app/constants/ticket-network-type/ticket-network-type';

@Component({
  selector: 'edit-broadcast-modal',
  templateUrl: './edit-broadcast-modal.component.html',
  styleUrls: ['./edit-broadcast-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    IonHeader,
    FormsModule,
    IonCheckbox,
  ],
})
export class EditBroadcastModalComponent {
  public readonly modalController = inject(ModalController);

  public eventTicketGroup = input<EventTicketGroup[]>([]);

  public allSelected = signal<boolean>(false);
  public networkTypes = signal<NetworkTypeModel[]>([]);

  constructor() {
    effect(() => this.eventTicketGroup() && untracked(() => {
      if (this.eventTicketGroup() && this.eventTicketGroup().length) {
        const selectedIds = this.eventTicketGroup()[0].userShNetworksList || [];
        const initializedNetworkTypes = TICKET_NETWORK_TYPE_ARRAY.map(networkType => ({
          ...networkType,
          isChecked: selectedIds.includes(networkType.id),
        }));

        this.networkTypes.set(initializedNetworkTypes);
        this.updateAllSelectedState();
      } else {
        const defaultNetworkTypes = TICKET_NETWORK_TYPE_ARRAY.map(networkType => ({
          ...networkType,
          isChecked: false,
        }));

        this.networkTypes.set(defaultNetworkTypes);
        this.allSelected.set(false);
      }
    }));
  }

  public toggleNetworkType(networkTypeId: number, isChecked: boolean): void {
    this.networkTypes.update(types => types.map(type => type.id === networkTypeId ? { ...type, isChecked } : type));

    this.updateAllSelectedState();
  }

  public toggleSelectAll(): void {
    const newState = !this.allSelected();

    this.allSelected.set(newState);
    this.networkTypes.update(types =>
      types.map(type => ({ ...type, isChecked: newState })),
    );
  }

  private updateAllSelectedState(): void {
    const allChecked = this.networkTypes().every(type => type.isChecked);

    this.allSelected.set(allChecked);
  }
}
