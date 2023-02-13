const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const Constants = require('../utils/constants');

const {
  getMe,
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/', getUsers);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser,
);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).pattern(Constants.REGEXPHTTP),
  }),
}), updateAvatar);

module.exports = router;
