const express = require('express');
const walletController = require('../controller/walletController');


const router = express.Router();

router.get('/balance', walletController.getBalance);
router.post('/top-up', walletController.topUp);
router.post('/make-payment', walletController.makePayment);
router.get('/exchange-rate', walletController.getExchangeRate);
router.post('/check-out', walletController.checkOut);

module.exports = router;
