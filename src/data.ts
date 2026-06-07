export type Ticket = {
  ticketId: string;
  eventName: string;
  faceValue: number;
  currency: string;
  currentOwner: string | null;
  status: "available" | "sold";
};

export const tickets: Ticket[] = [
  {
    ticketId: "TICKET-001",
    eventName: "Arsenal vs Chelsea",
    faceValue: 60,
    currency: "GBP",
    currentOwner: null,
    status: "available",
  },
];