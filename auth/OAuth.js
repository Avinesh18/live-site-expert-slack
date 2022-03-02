const path = require('path')
const https = require('https')
const querystring = require('querystring')
const FormData = require('form-data')

const SLACK_OAUTH_URL = new URL("https://slack.com/api/oauth.v2.access");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

var _codeExchangeMap = new Map();

module.exports.codeExchange = function(req, res) {
    console.log(req.query);
    // res.sendFile(path.join(__dirname, 'OAuthRedirect.html'))
    return res.sendStatus(200);
    let code = req.query.code;
    _codeExchangeMap.set(code, { state: 'QUEUED' });

    let form_data = new FormData();
    form_data.append('code', code);
    form_data.append('client_id', CLIENT_ID);
    form_data.append('client_secret', CLIENT_SECRET);

    let options = {
        host: SLACK_OAUTH_URL.hostname,
        path: SLACK_OAUTH_URL.pathname,
        method: 'POST',
        headers: form_data.getHeaders()
    };

    let req_callback = function(res) {
        console.log('Status Code: ' + res.statusCode);

        res.on('data', chunk => {
            console.log(chunk.toString());
        })

        res.on('error', err => {
            console.error(err);
        })
    };

    let post_req = https.request(options, req_callback);
    form_data.pipe(post_req);
}

module.exports.codeExchangeStatus = function(req, res) {
    return res.send({ state: _codeExchangeMap.get(req.query.code).state });
}