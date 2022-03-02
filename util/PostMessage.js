const https = require('https');

const POST_MESSAGE_URL = new URL("https://slack.com/api/chat.postMessage")
var { _installationDetails } = require('./Installation');

function defaultResponseCallback(res) {
    console.log('statusCode: ' + res.statusCode);

    res.on('data', d => {
        // console.log(d.toString())
    })

    res.on('error', err => {
        console.error(err)
    })
}

module.exports.postMessageChannel = async function(team, channel, text, callback) {
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

    let req = https.request(options, callback || defaultResponseCallback);

    req.write(JSON.stringify(payload));
    req.end();
}

module.exports.postMessageThread = async function(team, channel, text, thread_ts, broadcast, callback) {
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

    let req = https.request(options, callback || defaultResponseCallback);

    req.write(JSON.stringify(payload));
    req.end();
}