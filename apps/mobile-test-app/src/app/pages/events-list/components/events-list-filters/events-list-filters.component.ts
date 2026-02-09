import { addIcons } from 'ionicons';
import { NgxMaskDirective } from 'ngx-mask';
import { KeyValuePipe } from '@angular/common';
import type { ModalOptions } from '@ionic/core';
import { FormsModule, NgForm } from '@angular/forms';
import { chevronDownOutline, chevronUpOutline, calendarClearOutline, searchOutline, closeCircle } from 'ionicons/icons';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { IonButton, IonCheckbox, IonDatetime, IonIcon, IonItem, IonLabel, IonModal, IonPopover, IonSelect, IonSelectOption, ModalController } from '@ionic/angular/standalone';

import { FORM_FIELD } from './constants/form-field';
import { EVENT_TYPE_DATA } from './constants/event-types';
import { EventsFilters } from '../../../../shared/models/events/events';
import { EVENT_FILTERS_STATUS } from '../../constants/event-tabs-filters';
import { getDateFromRange } from './helpers/get-date-from-date-range.helper';
import { EVENTS_MODE } from '@mobile-test-app/constants/events-mode/events-mode';
import { SearchEvent } from '@mobile-test-app/models/search-events/search-event';
import { originalOrder } from '@mobile-test-app/helpers/original-order-helpers/original-order.helpers';
import { SearchEventsModalComponent } from './modals/search-events-autocomplete/search-events-modal.component';
import { getDisplayDate, getISOString, validateDate } from '@mobile-test-app/helpers/date-helpers/date.helpers';
import { SelectCategoriesModalComponent } from './modals/select-categories-modal/select-categories-modal.component';
import { DATE_RANGE_TYPE_ID, DATE_RANGE_TYPES_DATA } from '../../../../shared/constants/date-range/date-range-type-id';

@Component({
  standalone: true,
  selector: 'events-list-filters',
  templateUrl: './events-list-filters.component.html',
  styleUrls: ['./events-list-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonIcon,
    IonItem,
    IonLabel,
    IonSelect,
    IonButton,
    IonPopover,
    IonCheckbox,
    IonDatetime,
    FormsModule,
    KeyValuePipe,
    IonSelectOption,
    NgxMaskDirective,
  ],
})
export class EventsListFiltersComponent {
  private readonly modalController = inject(ModalController);

  public endDateModalRef = viewChild<IonModal>('endDateModal');
  public startDateModalRef = viewChild<IonModal>('startDateModal');

  public filters = input<EventsFilters>();
  public eventMode = input<EVENTS_MODE>();

  public setFilters = output<EventsFilters>();
  public changeEventMode = output<EVENTS_MODE>();

  public manualStartDate = signal<Date>(null);
  public manualEndDate = signal<Date>(null);
  public startDateError = signal<string>(null);
  public endDateError = signal<string>(null);
  public selectedCategoryIds = signal<number[]>([]);
  public selectedSearchEvent = signal<SearchEvent>(null);
  public statusValues = signal<Record<string, boolean>>({
    [EVENT_FILTERS_STATUS.available]: true,
    [EVENT_FILTERS_STATUS.expired]: false,
    [EVENT_FILTERS_STATUS.sold]: false,
  });

  public selectedEventType = signal<number | null>(null);

  protected readonly FORM_FIELD = FORM_FIELD;
  protected readonly originalOrder = originalOrder;
  protected readonly getISOString = getISOString;
  protected readonly getDisplayDate = getDisplayDate;
  protected readonly DATE_RANGE_TYPE_ID = DATE_RANGE_TYPE_ID;
  protected readonly EVENT_FILTERS_STATUS = EVENT_FILTERS_STATUS;
  protected readonly getDateFromRange = getDateFromRange;
  protected readonly EVENT_TYPE_DATA = Object.values(EVENT_TYPE_DATA);
  protected readonly DATE_RANGE_TYPES_DATA = Object.values(DATE_RANGE_TYPES_DATA);

  constructor() {
    addIcons({ chevronDownOutline, chevronUpOutline, calendarClearOutline, searchOutline, closeCircle });

    effect(() => {
      if (this.filters) {
        this.statusValues.set({
          [EVENT_FILTERS_STATUS.available]: this.filters().includeAvailable ?? true,
          [EVENT_FILTERS_STATUS.expired]: this.filters().includeExpired ?? false,
          [EVENT_FILTERS_STATUS.sold]: this.filters().includeSold ?? false,
        });

        if (this.filters().startDate) {
          this.manualStartDate.set(this.filters().startDate);
        }

        if (this.filters().endDate) {
          this.manualEndDate.set(this.filters().endDate);
        }

        if (this.filters().performerTypeIDs) {
          this.selectedCategoryIds.set(this.filters().performerTypeIDs);
        }

        this.selectedEventType.set(this.filters()?.eventSearchType);
        this.selectedSearchEvent.set(this.filters()?.searchEvent);
      }
    });
  }

  public toggleStatus(statusValue: string): void {
    const currentValues = this.statusValues();

    this.statusValues.set({ ...currentValues, [statusValue]: !currentValues[statusValue] });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onStartDateBlur(event: any): void {
    const inputValue = event.target.value;

    if (!inputValue) {
      this.manualStartDate.set(null);

      return;
    }

    const validatedDate = validateDate(inputValue);

    if (!validatedDate) {
      this.startDateError.set('Invalid date format. Use MM/DD/YYYY');
      this.manualStartDate.set(null);
    } else {
      this.manualStartDate.set(validatedDate);

      if (this.manualEndDate() && validatedDate > this.manualEndDate()) {
        this.startDateError.set('Start date must be before end date');
      } else {
        this.startDateError.set(null);

        if (this.manualEndDate() && this.endDateError() && validatedDate <= this.manualEndDate()) {
          this.endDateError.set(null);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onEndDateBlur(event: any): void {
    const inputValue = event.target.value;

    if (!inputValue) {
      this.manualEndDate.set(null);

      return;
    }

    const validatedDate = validateDate(inputValue);

    if (!validatedDate) {
      this.endDateError.set('Invalid date format. Use MM/DD/YYYY');
      this.manualEndDate.set(null);
    } else {
      this.manualEndDate.set(validatedDate);

      if (this.manualStartDate() && validatedDate < this.manualStartDate()) {
        this.endDateError.set('End date must be after start date');
      } else {
        this.endDateError.set(null);

        if (this.manualStartDate() && this.startDateError() && validatedDate >= this.manualStartDate()) {
          this.startDateError.set(null);
        }
      }
    }
  }

  public applyForm(form: NgForm): void {
    if (this.startDateError() || this.endDateError()) {
      return;
    }

    const filtersData: EventsFilters = {
      ...this.filters(),
      includeAvailable: this.statusValues()[EVENT_FILTERS_STATUS.available],
      includeExpired: this.statusValues()[EVENT_FILTERS_STATUS.expired],
      includeSold: this.statusValues()[EVENT_FILTERS_STATUS.sold],
      startDate: form.value[FORM_FIELD.dateRange] !== DATE_RANGE_TYPE_ID.custom
        ? getDateFromRange(form.value[FORM_FIELD.dateRange]).startDate
        : this.manualStartDate(),
      endDate: form.value[FORM_FIELD.dateRange] !== DATE_RANGE_TYPE_ID.custom
        ? getDateFromRange(form.value[FORM_FIELD.dateRange]).endDate
        : this.manualEndDate(),
      performerTypeIDs: this.selectedCategoryIds(),
      includeParking: form.value[FORM_FIELD.parking],
      includeRegular: form.value[FORM_FIELD.regularEvents],
      searchEvent: this.selectedSearchEvent(),
      eventId: this.selectedSearchEvent()?.id,
      eventSearchType: this.selectedEventType(),
      selectedDateRange: form.value[FORM_FIELD.dateRange],
    };

    this.modalController.dismiss(filtersData);
  }

  public async openCategoriesModal(): Promise<void> {
    const modal = await this.modalController.create(this.prepareSelectCategoriesModalComponent());

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) return;

    this.selectedCategoryIds.set(data);
  }

  public async openSearchEventModal(): Promise<void> {
    const modal = await this.modalController.create(this.prepareSearchEventModalComponent());

    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.selectedSearchEvent.set(data);
  }

  public changeStartDate(event: CustomEvent): void {
    const newStartDate = new Date(event.detail.value);

    this.manualStartDate.set(newStartDate);

    if (this.manualEndDate() && newStartDate > this.manualEndDate()) {
      this.startDateError.set('Start date must be before end date');
    } else {
      this.startDateError.set(null);

      if (this.manualEndDate() && this.endDateError() && newStartDate <= this.manualEndDate()) {
        this.endDateError.set(null);
      }
    }

    this.startDateModalRef()?.dismiss();
  }

  public onEndDateChange(event: CustomEvent): void {
    const newEndDate = new Date(event.detail.value);

    this.manualEndDate.set(newEndDate);

    if (this.manualStartDate() && newEndDate < this.manualStartDate()) {
      this.endDateError.set('End date must be after start date');
    } else {
      this.endDateError.set(null);

      if (this.manualStartDate() && this.startDateError() && newEndDate >= this.manualStartDate()) {
        this.startDateError.set(null);
      }
    }
    this.endDateModalRef()?.dismiss();
  }

  public onEventTypeChange(index: number): void {
    if (this.selectedEventType() === index) {
      return;
    }

    this.selectedEventType.set(index);
  }

  private prepareSelectCategoriesModalComponent(): ModalOptions {
    return {
      component: SelectCategoriesModalComponent,
      cssClass: 'custom-modal select-categories-modal',
      componentProps: { selectedCategoryIds: this.selectedCategoryIds() },
    };
  }

  private prepareSearchEventModalComponent(): ModalOptions {
    return {
      component: SearchEventsModalComponent,
      cssClass: 'custom-modal search-events-modal',
      componentProps: { searchEvent: this.selectedSearchEvent() },
    };
  }
}
