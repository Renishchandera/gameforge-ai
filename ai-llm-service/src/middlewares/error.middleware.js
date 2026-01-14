module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "AI service error",
    error: err.message,
  });
};
