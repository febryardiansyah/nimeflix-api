// Shared response helpers so every endpoint returns the same predictable
// envelope: { success, message, data }. This makes the API easy to
// consume from a frontend since callers can always rely on the same
// top-level shape regardless of which route they hit.

const success = (res, data = null, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const error = (res, message = "Something went wrong", statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

module.exports = { success, error };
