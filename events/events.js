const express = require('express')
const router = express.Router()
const { handleEvent } = require('./EventsHandler')

router.post('', (req, res) => {
    console.log(req.body)
    handleEvent(req, res);
});

module.exports = router;