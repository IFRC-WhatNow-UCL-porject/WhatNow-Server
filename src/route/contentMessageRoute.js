const express = require('express');
const MessageController = require('../controllers/MessageController');
const MessageValidator = require('../validator/MessageValidator');

const router = express.Router();
const auth = require('../middlewares/contentMessageRouteAuth');

const messageController = new MessageController();
const messageValidator = new MessageValidator();

// message routes
router.post('/get_content_message', auth(), messageValidator.messageGetValidator, messageController.getContentMessage);

router.post('/update_content_message', auth(), messageValidator.messageUpdateValidator, messageController.updateContentMessage);

module.exports = router;