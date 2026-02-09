import { DATE_RANGE_TYPE_ID } from '@mobile-test-app/constants/date-range/date-range-type-id';
import { getDateShiftMs, getThisMonthRange, getThisYearRange } from '@mobile-test-app/helpers/date-helpers/date.helpers';

export function getDateFromRange(dateRange: DATE_RANGE_TYPE_ID): { startDate: Date, endDate: Date } {
  switch (dateRange) {
    case DATE_RANGE_TYPE_ID.today:
      return {
        startDate: getDateShiftMs({ days: 0 }, new Date()),
        endDate: getDateShiftMs({ days: 0 }, new Date(), 'add'),
      };

    case DATE_RANGE_TYPE_ID.sevenDays:
      return {
        startDate: getDateShiftMs({ days: 0 }, new Date()),
        endDate: getDateShiftMs({ days: 6 }, new Date(), 'add'),
      };

    case DATE_RANGE_TYPE_ID.fourteenDays:
      return {
        startDate: getDateShiftMs({ days: 0 }, new Date()),
        endDate: getDateShiftMs({ days: 13 }, new Date(), 'add'),
      };

    case DATE_RANGE_TYPE_ID.thirtyDays:
      return {
        startDate: getDateShiftMs({ days: 0 }, new Date()),
        endDate: getDateShiftMs({ days: 29 }, new Date(), 'add'),
      };

    case DATE_RANGE_TYPE_ID.twelveMonths:
      return {
        startDate: getDateShiftMs({ days: 0 }, new Date()),
        endDate: getDateShiftMs({ months: 12 }, new Date(), 'add'),
      };

    case DATE_RANGE_TYPE_ID.thisMonth: {
      const monthRange = getThisMonthRange();

      return {
        startDate: new Date(monthRange.startDate),
        endDate: new Date(monthRange.endDate),
      };
    }

    case DATE_RANGE_TYPE_ID.thisYear: {
      const yearRange = getThisYearRange();

      return {
        startDate: new Date(yearRange.startDate),
        endDate: new Date(yearRange.endDate),
      };
    }

    default:
      return {
        startDate: getDateShiftMs({ days: 0 }, new Date()),
        endDate: getDateShiftMs({ days: 30 }, new Date(), 'add'),
      };
  }
}
