import { ConfirmModalData } from '@mobile-test-app/models/confirm-modal-data/confirm-modal-data';

export enum CONFIRM_MODAL_CLOSE_TYPES {
  ok = 1,
  close,
  cancel,
  backdrop,
}

export function getNotificationSelectAtLeastOneBlock(): ConfirmModalData {
  return {
    ...new ConfirmModalData(),
    title: 'Message',
    message: 'Please select at least one block to apply adjustments.',
    isCancelBtn: true,
    cancelLabel: 'Close',
    isOkBtn: false,
  };
}

export function getNotificationSelectAtLeastOneBlockToUnlock(): ConfirmModalData {
  return {
    ...new ConfirmModalData(),
    title: 'Message',
    message: 'Please select at least one block to apply unlock action.',
    isCancelBtn: true,
    cancelLabel: 'Close',
    isOkBtn: false,
  };
}

export function getNotificationSelectAtLeastOneListing(): ConfirmModalData {
  return {
    ...new ConfirmModalData(),
    title: 'Message',
    message: 'Please select at least one listing to edit broadcast settings.',
    isCancelBtn: true,
    cancelLabel: 'Close',
    isOkBtn: false,
  };
}
