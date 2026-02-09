import { TicketNetworkStatus } from '@mobile-test-app/models/ticket-network-status/ticket-network-status';
import { TicketNetworkTypeStateType } from '@mobile-test-app/constants/ticket-network-type/network-state';

export function createNetworkStatus(networkId: number, isChecked: boolean | undefined | null): TicketNetworkStatus {
  return {
    networkType: networkId,
    state: isChecked === true
      ? TicketNetworkTypeStateType.Checked
      : isChecked === false
        ? TicketNetworkTypeStateType.Unchecked
        : TicketNetworkTypeStateType.Unknown,
  };
}

export function calculateSharedNetworks(networkStatuses: TicketNetworkStatus[]): number {
  return networkStatuses
    .filter(status => status.state === TicketNetworkTypeStateType.Checked)
    .map(status => status.networkType)
    .reduce((sum, networkType) => sum + networkType, 0);
}

export function calculateNetworkMask(allStatuses: TicketNetworkStatus[], usedStatuses: TicketNetworkStatus[]): number {
  const filterMask = allStatuses.filter(
    status =>
      status.state !== TicketNetworkTypeStateType.Unknown ||
      (status.state === TicketNetworkTypeStateType.Unknown &&
        usedStatuses.some(used => used.networkType === status.networkType)),
  );

  return filterMask.reduce((sum, status) => sum + status.networkType, 0);
}
