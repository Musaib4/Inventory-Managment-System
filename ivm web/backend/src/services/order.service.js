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
  let { from, to,latest, status, page = 1, limit = 5 } = queryParams;
    const query = {};

    page = Math.max(1, Number.parseInt(page, 10) || 1);
    limit = Math.max(1, Number.parseInt(limit, 10) || 5);

    const MAX_LIMIT = 200;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (from && isNaN(fromDate.getTime())) throw new Error("Invalid 'from' date");
    if (to && isNaN(toDate.getTime())) throw new Error("Invalid 'to' date");
    if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
      throw new Error("'from' date must be <= 'to' date");
    }

    // status filter (optional)
    if (status) query.status = status;

    // date range filter (optional)
    if (fromDate && toDate) {
      query.createdAt = {
        $gte: startOfDay(fromDate),
        $lte: endOfDay(toDate)
      };
    } else if (fromDate) {
      // from a date to now
      query.createdAt = { $gte: startOfDay(fromDate) };
    } else if (toDate) {
      // up to a given date
      query.createdAt = { $lte: endOfDay(toDate) };
    } else if (latest === "true") {   // FIXED BOOLEAN
      const sevenDaysAgo = startOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));  // FIXED
      query.createdAt = { $gte: sevenDaysAgo };
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
    data: orders,
  };
}

