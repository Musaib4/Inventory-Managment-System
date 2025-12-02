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

// date filters

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d;
}
function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23,59,59,999);
  return d;
}

export async function getByDate(queryParams) {
  const { from, to, status, page = 1, limit = 5 } = queryParams;
    const query = {};

    // status filter (optional)
    if (status) query.status = status;

    // date range filter (optional)
    if (from && to) {
      query.createdAt = {
        $gte: startOfDay(from),
        $lte: endOfDay(to)
      };
    } else if (from) {
      // from a date to now
      query.createdAt = { $gte: startOfDay(from) };
    } else if (to) {
      // up to a given date
      query.createdAt = { $lte: endOfDay(to) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const total = await Order.countDocuments(query);

    return {
    total,
    page: Number(page),
    limit: Number(limit),
    data: orders
  };
}

