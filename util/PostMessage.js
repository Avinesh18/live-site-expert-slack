const https = require('https')

const POST_MESSAGE_URL = new URL("https://slack.com/api/chat.postMessage")
const USER_TOKEN = process.env.USER_TOKEN

function defaultResponseCallback(res) {
    console.log('statusCode: ' + res.statusCode)
    if(res.statusCode == 302)
    {
        console.log('redirect: ' + res.headers.location)
        // console.log(res)
    }

    res.on('data', d => {
        console.log(d.toString())
    })

    res.on('error', err => {
        console.error(err)
    })
}

module.exports.postMessageChannel = function(text, channel, callback) {
    console.log(POST_MESSAGE_URL.hostname + POST_MESSAGE_URL.pathname);
    let post_req = https.request({
        hostname: POST_MESSAGE_URL.hostname,
        path: POST_MESSAGE_URL.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + USER_TOKEN
        }
    }, callback || defaultResponseCallback);

    post_req.write(JSON.stringify({
        channel: channel,
        text: text
    }));

    post_req.end();
}