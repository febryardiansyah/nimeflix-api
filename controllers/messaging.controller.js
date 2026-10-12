const NotificationModel = require("../models/notificationModel");
const response = require("../helpers/response");
const errors = require("../helpers/errors");

exports.postNotification = async (req, res) => {
  const { title, version, link, logs } = req.body;
  try {
    const notification = new NotificationModel({ title, version, link, logs });
    await notification.save();
    response.success(res, notification, "Notification created", 201);
  } catch (error) {
    errors.requestFailed(req, res, error);
  }
};

exports.getNotification = async (req, res) => {
  try {
    const data = await NotificationModel.find();
    response.success(res, data[data.length - 1] || null);
  } catch (error) {
    errors.requestFailed(req, res, error);
  }
};
