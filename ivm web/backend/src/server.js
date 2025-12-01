// src/server.js
import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./db/mongoose.js";

const startServer = async () => {
  try {
    await connectDB();  // connect to MongoDB
    const PORT = config.port;

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();
