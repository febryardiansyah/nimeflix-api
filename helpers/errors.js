const response = require("./response");

const on404 = (req, res) => {
  response.error(res, "Resource not found", 404);
};

const requestFailed = (req, res, err) => {
  response.error(res, err?.message || "Request failed", 502);
};

module.exports = { on404, requestFailed };
