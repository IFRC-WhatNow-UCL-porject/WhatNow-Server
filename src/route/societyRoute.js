const express = require('express');
const SocietyController = require('../controllers/SocietyController');
const SocietyValidator = require('../validator/SocietyValidator');

const router = express.Router();
const auth = require('../middlewares/societyRouteAuth');

const societyController = new SocietyController();
const societyValidator = new SocietyValidator();

router.post('/get_user_societies', auth(), societyValidator.getUserSocietiesValidator, societyController.getUserSocieties);

router.post('/get_all_societies', auth(), societyValidator.getAllSocietiesValidator, societyController.getAllSocieties);

module.exports = router;