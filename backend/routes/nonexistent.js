const router = require('express').Router();
const { handlingPath } = require('../controllers/nonexistent');

router.all('/*', handlingPath);

module.exports = router;
