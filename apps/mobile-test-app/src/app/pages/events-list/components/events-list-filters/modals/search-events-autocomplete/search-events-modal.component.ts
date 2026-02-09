import { IonButton, IonContent, IonHeader, IonIcon, IonSearchbar, ModalController } from '@ionic/angular/standalone';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal, untracked, ViewEncapsulation } from '@angular/core';

import { SearchEvent } from '@mobile-test-app/models/search-events/search-event';
import { SearchEventsStore } from '../../../../../../shared/store/search-events/search-events.store';

@Component({
  standalone: true,
  selector: 'search-events-modal',
  templateUrl: './search-events-modal.component.html',
  styleUrls: ['./search-events-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonButton,
    IonHeader,
    IonContent,
    IonSearchbar,
  ],
})
export class SearchEventsModalComponent implements OnInit {
  public readonly modalController = inject(ModalController);
  public readonly searchEventsStore = inject(SearchEventsStore);

  public readonly searchEvent = input<SearchEvent>(null);

  public readonly searchValue = signal<string>('');
  public readonly selectedEvent = signal<SearchEvent>(null);
  public readonly filteredEvents = signal<SearchEvent[]>([]);

  constructor() {
    effect(() => {
      const storeEvents = this.searchEventsStore.searchEvents();

      if (storeEvents && storeEvents.length > 0) {
        untracked(() => {
          const inputEvent = this.searchEvent();

          if (inputEvent) {
            this.selectedEvent.set(inputEvent);
            this.searchValue.set(inputEvent.name);
          }
        });
      }
    });
  }

  public ngOnInit(): void {
    this.getSearchEvents();
  }

  public onSearchChange(value: string): void {
    this.searchValue.set(value);

    if (!value) {
      this.filteredEvents.set([]);

      return;
    }

    const lowerValue = value.toLowerCase();
    const matched: SearchEvent[] = [];

    for (const event of this.searchEventsStore.searchEvents()) {
      if (event.name.toLowerCase().includes(lowerValue)) {
        matched.push(event);

        if (matched.length >= 15) {
          break;
        }
      }
    }

    this.filteredEvents.set(matched);
  }

  public onClear(): void {
    this.searchValue.set('');
    this.selectedEvent.set(null);
    this.filteredEvents.set([]);
  }

  public onSelectEvent(event: SearchEvent): void {
    this.selectedEvent.set(event);
    this.searchValue.set(event.name);
    this.filteredEvents.set([]);
  }

  public save(): void {
    this.modalController.dismiss(this.selectedEvent());
  }

  public getSearchEvents(isForceReload: boolean = false): void {
    this.searchEventsStore.getSearchEvents(isForceReload);
  }
}
