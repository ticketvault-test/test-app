import { NetworkTypeModel } from '@mobile-test-app/models/network-type-model/network-type-model';

export enum TICKET_NETWORK_TYPE_ID {
  none = 0,
  vivid = 1,
  tickPick = 4,
  ticketEvolution = 16,
  gameTime = 32,
  ticketmaster = 64,
  seatGeek = 128,
  ticketNetwork = 256,
  stubhub = 1024,
  goTickets = 2048,
  axs = 4096,
  all = 8191,
}

export enum TICKET_NETWORK_TYPE_NAME {
  seatGeek = 'SeatGeek',
  ticketMaster = 'TicketMaster',
  stubHub = 'StubHub',
  gameTime = 'GameTime',
  vivid = 'Vivid Seats',
  tevo = 'Tevo',
  axs = 'AXS',
  tickPick = 'TickPick',
  viagogo = 'Viagogo',
  goTickets = 'GoTickets',
  ticketEvolution = 'Ticket Evolution',
  ticketNetwork = 'Ticket Network',
}

export const TICKET_NETWORK_TYPE_ARRAY: NetworkTypeModel[] = [
  {
    id: TICKET_NETWORK_TYPE_ID.axs,
    name: TICKET_NETWORK_TYPE_NAME.axs,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.tickPick,
    name: TICKET_NETWORK_TYPE_NAME.tickPick,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.gameTime,
    name: TICKET_NETWORK_TYPE_NAME.gameTime,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.ticketEvolution,
    name: TICKET_NETWORK_TYPE_NAME.ticketEvolution,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.seatGeek,
    name: TICKET_NETWORK_TYPE_NAME.seatGeek,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.ticketNetwork,
    name: TICKET_NETWORK_TYPE_NAME.ticketNetwork,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.stubhub,
    name: TICKET_NETWORK_TYPE_NAME.stubHub,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.ticketmaster,
    name: TICKET_NETWORK_TYPE_NAME.ticketMaster,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.vivid,
    name: TICKET_NETWORK_TYPE_NAME.vivid,
    isChecked: false,
  },
  {
    id: TICKET_NETWORK_TYPE_ID.goTickets,
    name: TICKET_NETWORK_TYPE_NAME.goTickets,
    isChecked: false,
  },
];
