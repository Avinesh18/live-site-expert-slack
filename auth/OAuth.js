const path = require('path')
const https = require('https')
const querystring = require('querystring')
const FormData = require('form-data')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

var _codeExchangeMap = new Map();
module.exports._codeExchangeMap = _codeExchangeMap;

const { getAccessToken } = require('../util/OAuthCodeExchange');

module.exports.codeExchange = function(req, res) {
    let code = req.query.code;
    if(_codeExchangeMap.get(code))
    {
        return res.sendStatus(200);
    }
    console.log(req.query);
    createNewInstallation(code);
    return res.sendStatus(200);
}

module.exports.codeExchangeStatus = function(req, res) {
    return res.send({ state: _codeExchangeMap.get(req.query.code) });
}

async function createNewInstallation(code) {
    let token = await getAccessToken(code);   
}