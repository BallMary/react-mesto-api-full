module.exports = (err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ой! Произошла ошибка на сервере'
        : message,
    });
  next();
};
