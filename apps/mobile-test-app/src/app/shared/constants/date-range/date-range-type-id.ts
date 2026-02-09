import { KeyStringModel } from '../../models/key-string/key-string';

export enum DATE_RANGE_TYPE_ID {
  today = 1,
  sevenDays = 2,
  fourteenDays = 3,
  thirtyDays = 4,
  twelveMonths = 5,
  thisMonth = 6,
  thisYear = 7,
  custom = 8
}

export enum DATE_RANGE_TYPE_NAME {
  today = 'Today',
  sevenDays = '7 Days',
  fourteenDays = '14 Days',
  thirtyDays = '30 Days',
  twelveMonths = '12 Months',
  thisMonth = 'This Month',
  thisYear = 'This Year',
  custom = 'Custom',
}

export const DATE_RANGE_TYPES_DATA: KeyStringModel<{ id: number, name: string }> = {
  [DATE_RANGE_TYPE_ID.today]: {
    id: DATE_RANGE_TYPE_ID.today,
    name: DATE_RANGE_TYPE_NAME.today,
  },
  [DATE_RANGE_TYPE_ID.sevenDays]: {
    id: DATE_RANGE_TYPE_ID.sevenDays,
    name: DATE_RANGE_TYPE_NAME.sevenDays,
  },
  [DATE_RANGE_TYPE_ID.fourteenDays]: {
    id: DATE_RANGE_TYPE_ID.fourteenDays,
    name: DATE_RANGE_TYPE_NAME.fourteenDays,
  },
  [DATE_RANGE_TYPE_ID.thirtyDays]: {
    id: DATE_RANGE_TYPE_ID.thirtyDays,
    name: DATE_RANGE_TYPE_NAME.thirtyDays,
  },
  [DATE_RANGE_TYPE_ID.twelveMonths]: {
    id: DATE_RANGE_TYPE_ID.twelveMonths,
    name: DATE_RANGE_TYPE_NAME.twelveMonths,
  },
  [DATE_RANGE_TYPE_ID.thisMonth]: {
    id: DATE_RANGE_TYPE_ID.thisMonth,
    name: DATE_RANGE_TYPE_NAME.thisMonth,
  },
  [DATE_RANGE_TYPE_ID.thisYear]: {
    id: DATE_RANGE_TYPE_ID.thisYear,
    name: DATE_RANGE_TYPE_NAME.thisYear,
  },
  [DATE_RANGE_TYPE_ID.custom]: {
    id: DATE_RANGE_TYPE_ID.custom,
    name: DATE_RANGE_TYPE_NAME.custom,
  },
};
