import * as orderService from "../services/order.service.js";

export async function createOrderHandler(req, res, next) {
  try {
    const payload = req.body;
    // Basic validation — ensure required fields
    if (!payload.id || !payload.dest || !payload.customer) {
      return res.status(400).json({ message: "id, dest and customer are required." });
    }

    const created = await orderService.createOrder(payload);
    return res.status(201).json({ data: created });
  } catch (err) {
    // duplicate key example: handle unique index errors
    if (err.code === 11000) {
      return res.status(409).json({ message: "Order with this id already exists" });
    }
    next(err);
  }
}