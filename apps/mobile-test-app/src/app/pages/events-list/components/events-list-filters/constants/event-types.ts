import { KeyStringModel } from '@mobile-test-app/models/key-string/key-string';

export enum EVENT_TYPE_NAME {
  main = 'main',
  secondary = 'secondary',
  both = 'both',
}

export enum EVENT_TYPE_ID {
  main = 0,
  secondary = 1,
  both = 2,
}

export const EVENT_TYPE_DATA: KeyStringModel<{ name: string, isChecked: boolean }> = {
  [EVENT_TYPE_ID.main]: {
    name: EVENT_TYPE_NAME.main,
    isChecked: true,
  },
  [EVENT_TYPE_ID.secondary]: {
    name: EVENT_TYPE_NAME.secondary,
    isChecked: false,
  },
  [EVENT_TYPE_ID.both]: {
    name: EVENT_TYPE_NAME.both,
    isChecked: false,
  },
};
