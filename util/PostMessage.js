const https = require('https')

const POST_MESSAGE_URL = new URL("https://slack.com/api/chat.postMessage")
const BOT_USER_TOKEN = process.env.BOT_USER_TOKEN

function defaultResponseCallback(res) {
    console.log('statusCode: ' + res.statusCode);

    res.on('data', d => {
        // console.log(d.toString())
    })

    res.on('error', err => {
        console.error(err)
    })
}

module.exports.postMessageChannel = async function(text, channel, callback) {
    console.log("Sending \"" + text + "\" to channel");
    let options = {
        hostname: POST_MESSAGE_URL.hostname,
        path: POST_MESSAGE_URL.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + BOT_USER_TOKEN 
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

module.exports.postMessageThread = async function(text, channel, thread_ts, broadcast, callback) {
    console.log("Sending \"" + text + "\" to thread");
    broadcast = broadcast || false;
    let options = {
        hostname: POST_MESSAGE_URL.hostname,
        path: POST_MESSAGE_URL.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + BOT_USER_TOKEN
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