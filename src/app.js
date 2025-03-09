require('dotenv').config();
const express = require("express");
const { swaggerUi, swaggerSpec } = require("./docs/swagger");
const morgan = require('morgan');
const cors = require('cors');

const roomRoutes = require("./routes/room.routes")
const userRoutes = require("./routes/user.routes")
const reservationRoutes = require("./routes/reservation.routes")
const notifications = require("./routes/notification.routes")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes)
app.use("/api/reservations",reservationRoutes)
app.use("/api/notifications", notifications)

// Swagger docs api
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
