const Constants = require('../utils/constants');
const NotFoundError = require('../middlewares/errors/not-found-err');

exports.handlingPath = (req, res, next) => {
  next(new NotFoundError(Constants.PAGE_NOT_FOUND));
};
