const path = require('path')
const https = require('https')
const querystring = require('querystring')
const FormData = require('form-data')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

var _codeExchangeMap = new Map();
module.exports._codeExchangeMap = _codeExchangeMap;

const { getAccessToken } = require('../util/OAuthCodeExchange');
const { getSelfInfo } = require('../util/UserInfo');
const { storeSecurely } = require('../util/SecureStorage');

module.exports.codeExchange = function(req, res) {
    let code = req.query.code;
    if(_codeExchangeMap.get(code))
    {
        return res.sendStatus(200);
    }
    console.log(req.query);
    _codeExchangeMap.set(code, 'PROCESSING');
    getDetailsAndCreateInstallation(code);
    // return res.sendFile(path.join(__dirname, 'OAuthRedirect.html'));
    return res.sendStatus(200);
}

module.exports.codeExchangeStatus = function(req, res) {
    return res.send({ state: _codeExchangeMap.get(req.query.code) });
}

async function getDetailsAndCreateInstallation(code) {
    let token = await getAccessToken(code);
    let self_data = await getSelfInfo(token);

    await storeSecurely(self_data.team_id, {
        user_id: self_data.user_id,
        bot_id: self_data.bot_id,
        bot_user_token: token
    });

    _codeExchangeMap.set(code, 'DONE');
}