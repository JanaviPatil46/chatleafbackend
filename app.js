// // const express = require('express');
// // const cors = require('cors')
// // const path = require('path')
// // const authRoutes = require('./routes/authRoutes');
// // const  userRoutes  = require('./routes/userRoutes');
// // const messageRoutes = require('./routes/messageRoutes');


// // const app = express();
// // app.use(cors())
// // app.use(express.json());
// // app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// // app.use("/api/auth", authRoutes);
// // app.use("/api/users", userRoutes);
// // app.use("/api/messages", messageRoutes);

// // module.exports = app;/
// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const messageRoutes = require("./routes/messageRoutes");

// const app = express();

// const corsOptions = {
//   origin: "https://chatleaf-messagingapp.netlify.app",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options("*", cors(corsOptions));

// app.use(express.json());

// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/messages", messageRoutes);

// module.exports = app;

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

const corsOptions = {
  origin: ["https://chatleaf-messagingapp.netlify.app","http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    message: "Chatleaf backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

module.exports = app;