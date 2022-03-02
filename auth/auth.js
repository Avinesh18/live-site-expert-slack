const express = require('express')
const router = express.Router();
const { codeExchange, codeExchangeStatus } = require('./OAuth')

router.get('/code-exchange', codeExchange)
router.get('/code-exchange-status', codeExchangeStatus) 

module.exports = router