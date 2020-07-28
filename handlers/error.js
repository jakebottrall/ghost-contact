function errorHandler(err, req, res, next) {
  console.log(err.message);
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Oops! Something went wrong.",
    },
  });
}

module.exports = errorHandler;
