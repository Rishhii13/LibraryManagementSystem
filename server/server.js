require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const smsRoutes = require("./routes/smsRoutes");

const { protect, authorize } = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Make Socket.IO available to API routes if needed later.
app.set("io", io);

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/", apiLimiter);
app.use(express.json({ limit: "10kb" }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/sms", smsRoutes);

app.get("/api/protected", protect, (req, res) => {
  return res.status(200).json({
    message: "Access granted. You are authenticated.",
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

app.get(
  "/api/admin-test",
  protect,
  authorize("admin"),
  (req, res) => {
    return res.status(200).json({
      message: "Admin access granted.",
      user: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Library Management System API is running",
  });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large.",
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request body.",
    });
  }

  console.error("Server error:", err.message);

  return res.status(500).json({
    message: "An internal server error occurred.",
  });
});

// ================= SOCKET.IO =================

io.on("connection", (socket) => {
  console.log("WebSocket client connected:", socket.id);

  socket.emit("connection-success", {
    message: "Connected to Library Management System real-time server.",
  });

  socket.on("disconnect", () => {
    console.log("WebSocket client disconnected:", socket.id);
  });
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Socket.IO real-time server is ready.");
});