import Order from "../models/orders.model.js";

export async function createOrder(payload) {
  // payload is an object with the order fields
  // returns the created document
  const order = await Order.create(payload);
  return order;
}

export async function createManyOrders(arrayOfOrders) {
  // insertMany for bulk inserts
  const docs = await Order.insertMany(arrayOfOrders, { ordered: true });
  return docs;
}

export async function getOrders(filter = {}) {
  return Order.find(filter).sort({ createdAt: -1 });
}

