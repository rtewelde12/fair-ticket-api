import { Ticket } from "./data";

export function validateResalePrice(
  ticket: Ticket,
  resalePrice: number
) {
  if (resalePrice !== ticket.faceValue) {
    return {
      approved: false,
      reason: "Ticket must be resold at original face value",
      allowedPrice: ticket.faceValue,
    };
  }

  return {
    approved: true,
    reason: "Approved",
    allowedPrice: ticket.faceValue,
  };
}