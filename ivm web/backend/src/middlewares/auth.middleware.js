import jwt from "jsonwebtoken";

/**
 * Protect routes using JWT.
 * Reads token from Authorization header: "Bearer <token>"
 */
export const authenticate = (req, res, next) => {
  try {
    // 1. Get header
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    // 3. Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request (so controllers can read it)
    req.user = { id: payload.id, email: payload.email };

    // 5. Continue
    next();
  } catch (err) {
    // Token expired or invalid
    return res.status(403).json({ message: "Token is invalid or expired", error: err.message });
  }
};
