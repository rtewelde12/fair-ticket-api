import express from "express";
import cors from "cors";

import { tickets } from "./data";
import { validateResalePrice } from "./pricingEngine";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Fair Ticket API",
    status: "Running",
  });
});

app.get("/tickets", (req, res) => {
  res.json(tickets);
});

app.post("/buy-ticket", (req, res) => {
  const { ticketId, buyerId } = req.body;

  const ticket = tickets.find(
    (t) => t.ticketId === ticketId
  );

  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found",
    });
  }

  if (ticket.status !== "available") {
    return res.status(400).json({
      message: "Ticket unavailable",
    });
  }

  ticket.currentOwner = buyerId;
  ticket.status = "sold";

  return res.json({
    success: true,
    ticket,
  });
});

app.post("/validate-resale", (req, res) => {
  const {
    ticketId,
    sellerId,
    resalePrice,
  } = req.body;

  const ticket = tickets.find(
    (t) => t.ticketId === ticketId
  );

  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found",
    });
  }

  if (ticket.currentOwner !== sellerId) {
    return res.status(403).json({
      message: "Seller does not own ticket",
    });
  }

  const result = validateResalePrice(
    ticket,
    resalePrice
  );

  return res.json(result);
});

app.post("/resell-ticket", (req, res) => {
  const {
    ticketId,
    sellerId,
    buyerId,
    resalePrice,
  } = req.body;

  const ticket = tickets.find(
    (t) => t.ticketId === ticketId
  );

  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found",
    });
  }

  if (ticket.currentOwner !== sellerId) {
    return res.status(403).json({
      message: "Seller does not own ticket",
    });
  }

  const validation =
    validateResalePrice(
      ticket,
      resalePrice
    );

  if (!validation.approved) {
    return res.status(400).json(validation);
  }

  ticket.currentOwner = buyerId;

  return res.json({
    success: true,
    message:
      "Ticket resold successfully",
    ticket,
  });
});

app.listen(3000, () => {
  console.log(
    "Fair Ticket API running on port 3000"
  );
});