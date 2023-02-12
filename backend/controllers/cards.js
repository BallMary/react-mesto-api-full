const mongoose = require('mongoose');
const Card = require('../models/card');
const Constants = require('../utils/constants');
const NotFoundError = require('../middlewares/errors/not-found-err');
const BadRequestError = require('../middlewares/errors/bad-request');
const OwnerError = require('../middlewares/errors/owner-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res
      .status('201')
      .send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(Constants.CREATE_CARD_INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const cardId = await Card.findOne({ _id: req.params.cardId });
    const cardOwner = req.user._id;
    if (cardId === null) {
      next(new NotFoundError(Constants.NOT_FOUND_CARD_WITH_ID));
    } else if (cardId.owner.valueOf() === cardOwner) {
      const card = await Card.findByIdAndRemove(req.params.cardId);
      res.send(card);
    } else {
      next(new OwnerError(Constants.DELETE_PROHIBITED));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(Constants.INVALID_CARD_ID));
    } else {
      next(err);
    }
  }
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send(card);
    } else {
      next(new NotFoundError(Constants.NOT_FOUND_CARD_WITH_ID));
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(Constants.LIKE_OR_DISLIKE_INCORRECT_DATA));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send(card);
    } else {
      next(new NotFoundError(Constants.NOT_FOUND_CARD_WITH_ID));
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(Constants.LIKE_OR_DISLIKE_INCORRECT_DATA));
    } else {
      next(err);
    }
  });
