const validator = require("fastest-validator");
const models = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

function save(req, res) {
  //get token from header
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  let startDate = new Date(req.body.start);
  startDate.setDate(startDate.getDate() + 2); // Add 1 day to the start date

  // if (decoded["role"] !== "admin") {
  //   return res.status(401).json({});
  // }

  const agenda = {
    title: req.body.title,
    className: req.body.className,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
    userId: decoded["userId"],
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

  models.Agenda.create(agenda)
    .then((result) => {
      res.status(201).json({
        message: "Agenda created successfully",
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
  // Get the first and last date of the current month using moment.js
  const startParam = req.query.start;

  models.Agenda.findAll({
    where: {
      start: {
        [Op.like]: [`%${startParam}%`],
      },
    },
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
