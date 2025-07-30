// backend/routes/tickets.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/order', ticketController.createOrder);
router.get('/all', ticketController.getAllOrders);
router.get('/filter', ticketController.filterOrders);

module.exports = router;
