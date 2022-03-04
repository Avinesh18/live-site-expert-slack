const https = require('https');
const { resolve } = require('path');
const { HTTPStatusCodeError } = require('../util/HTTPError');

const POST_MESSAGE_URL = new URL("https://slack.com/api/chat.postMessage")
var { _installationDetails } = require('./Installation');

function defaultResponseCallback(res) {
    console.log('statusCode: ' + res.statusCode);
    if(res.statusCode != 200)
        reject(new HTTPStatusCodeError('', {
            host: req.host,
            path: req.path,
            method: req.path
        }), res.statusCode);

    res.on('data', chunk => {
        response_data += chunk.toString();
    })

    res.on('end', () => {
        resolve(response_data);
    })

    res.on('error', err => {
        reject(err);
    })
}

module.exports.postMessageChannel = function(team, channel, text) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Sending \"" + text + "\" to channel");
            let bot_user_token = _installationDetails.get(team).bot_user_token;
            let options = {
                hostname: POST_MESSAGE_URL.hostname,
                path: POST_MESSAGE_URL.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + bot_user_token
                }
            };

            let payload = {
                channel: channel,
                text: text
            };

            let response_data = '';
        
            let req = https.request(options, defaultResponseCallback);

            req.write(JSON.stringify(payload));
            req.end();
        }
        catch(e) {
            reject(e);
        }
    });
}

module.exports.postMessageThread = function(team, channel, text, thread_ts, broadcast) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Sending \"" + text + "\" to thread");
            console.log("Team: " + team);
            let bot_user_token = _installationDetails.get(team).bot_user_token;
            broadcast = broadcast || false;
            let options = {
                hostname: POST_MESSAGE_URL.hostname,
                path: POST_MESSAGE_URL.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + bot_user_token
                }
            };

            let payload = {
                'channel': channel,
                'thread_ts': thread_ts,
                'text': text,
                'reply_broadcast': broadcast
            };

            let response_data = '';

            let req = https.request(options, defaultResponseCallback);

            req.write(JSON.stringify(payload));
            req.end();
        }
        catch(e) {
            reject(e);
        }
    });
}