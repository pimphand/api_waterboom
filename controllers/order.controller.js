const validator = require("fastest-validator");
const models = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const order = require("../models/order");

function save(req, res) {
  //get token from header
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  let startDate = new Date(req.body.start);
  startDate.setDate(startDate.getDate() + 2); // Add 1 day to the start date

  // if (decoded["role"] !== "admin") {
  //   return res.status(401).json({});
  // }

  const order = {
    moneyChange: req.body.change,
    totalPayment: req.body.payment,
    totalPrice: req.body.total,
    quantity: req.body.items.map((item) => item.qty).reduce((a, b) => a + b, 0),
  };

  const schema = {
    moneyChange: { type: "number", optional: false },
    totalPayment: { type: "number", optional: false },
    totalPrice: { type: "number", optional: false },
    quantity: { type: "number", optional: false },
  };

  const vldator = new validator();
  const validationResponse = vldator.validate(order, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation failed",
      error: validationResponse,
    });
  }

  models.Order.create(order)
    .then((result) => {
      req.body.items.forEach((item) => {
        const orderItem = {
          created_by: decoded["userId"],
          order_id: result.id,
          ticket_type_id: item.id,
          quantity: item.qty,
          total_price: item.price * item.qty,
          price: item.price,
          purchaseAt: new Date(),
          is_scan: false,
        };
        models.Ticket.create(orderItem);
      });
      res.status(201).json({
        message: "Order created successfully",
        post: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something wrong",
        error: error,
      });
    });
}

function index(req, res) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set ke awal hari (00:00:00)

  models.Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: todayStart,
      },
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: models.Ticket,
        as: "Tickets",
        include: [
          {
            model: models.TicketType,
            as: "DetailsTicket",
          },
        ],
      },
    ],
  })
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).json({
          message: "Agenda fetched successfully",
          data: result,
        });
      } else {
        res.status(404).json({
          message: "Agenda not found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error.message,
      });
    });
}

//update agenda
function update(req, res) {
  const id = req.params.id;
  // Get the first and last date of the current month using moment.js
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  let startDate = new Date(req.body.start);
  startDate.setDate(startDate.getDate() + 2); // Add 1 day to the start date

  const agenda = {
    title: req.body.title,
    className: req.body.className,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
    updatedBy: decoded["userId"],
  };

  const schema = {
    title: { type: "string", required: false, max: "65" },
    description: { type: "string", optional: true, max: "200" },
    start: { type: "string", optional: false },
    end: { type: "string", optional: false },
  };

  const vldator = new validator();
  const validationResponse = vldator.validate(agenda, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation failed",
      error: validationResponse,
    });
  }

  models.Agenda.findByPk(id)
    .then((result) => {
      if (result) {
        models.Agenda.update(agenda, { where: { id: id } }).then((result) => {
          return res.status(200).json({
            message: "Agenda updated successfully",
            post: agenda,
          });
        });
      } else {
        res.status(404).json({
          message: "Agenda not found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something wrong",
        error: error,
      });
    });
}

module.exports = {
  save: save,
  index: index,
  update: update,
};
