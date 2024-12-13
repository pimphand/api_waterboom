const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors"); // Import cors
const moment = require("moment-timezone"); // Import moment-timezone

const postsRoute = require("./routes/posts");
const userRoute = require("./routes/user");
const imageRoute = require("./routes/images");
const agendaRoute = require("./routes/agenda");
const typeTickets = require("./routes/typeTicket");
const ticketsRoute = require("./routes/order");

app.use(cors()); // Allow all origins by default

app.use((req, res, next) => {
  req.timezone = moment.tz("Asia/Jakarta").format(); // Menambahkan properti timezone pada req
  next();
});

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/posts", postsRoute);
app.use("/user", userRoute);
app.use("/images", imageRoute);
app.use("/tickets", ticketsRoute);
app.use("/agenda", agendaRoute);
app.use("/type-tickets", typeTickets);

module.exports = app;
