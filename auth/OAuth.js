const path = require('path')
const https = require('https')
const querystring = require('querystring')

const SLACK_OAUTH = "https://slack.com/api/oauth.v2.access"
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

var _codeExchangeMap = new Map();

module.exports.codeExchange = function(req, res) {
    console.log(req.query);
    // res.sendFile(path.join(__dirname, 'OAuthRedirect.html'))
    res.sendStatus(200);
    let code = req.query.code;
    _codeExchangeMap.set(code, { state: 'QUEUED' });

    let post_data = querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    });

    let post_req = https.request({
        hostname: "slack.com",
        path: "/oauth/v2/authorize",
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, res => {
        console.log('statusCode: ' + res.statusCode)
        if(res.statusCode == 302)
        {
            console.log('redirect: ' + res.headers.location)
        }
            // console.log(res)

        res.on('data', d => {
            console.log(d.toString())
        })

        res.on('error', err => {
            console.error(err)
        })
    } );

    post_req.write(post_data);
    post_req.end();
}

module.exports.codeExchangeStatus = function(req, res) {
    return res.send({ state: _codeExchangeMap.get(req.query.code).state });
}