
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
const borrowRoutes = require("./routes/borrowRoutes");

const { protect, authorize } = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

// Allowed frontend addresses
const allowedOrigins = [
  "http://localhost:5173",
  "https://library-management-system-eight-gamma.vercel.app",
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);

    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS before other middleware and routes
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Security middleware
app.use(helmet());

// Rate limiting
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

// Parse JSON requests
app.use(express.json({ limit: "10kb" }));

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make Socket.IO available to API routes
app.set("io", io);

// Connect MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/borrowings", borrowRoutes);

// Protected route
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

// Admin test route
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

// Backend health check
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Library Management System API is running",
  });
});

// Error handler
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

// Socket.IO events
io.on("connection", (socket) => {
  console.log("WebSocket client connected:", socket.id);

  socket.emit("connection-success", {
    message: "Connected to Library Management System real-time server.",
  });

  socket.on("disconnect", () => {
    console.log("WebSocket client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Socket.IO real-time server is ready.");
});
