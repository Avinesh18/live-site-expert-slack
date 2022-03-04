const req = require('express/lib/request');
const https = require('https');
const { resolve } = require('path');
const { HTTPStatusCodeError } = require('./HTTPError');
const { SlackApiError } = require('./SlackError');

const AUTH_TEST_URL = new URL("https://slack.com/api/auth.test");

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
        let data = JSON.parse(response_data);
        if(data.ok)
            resolve(data)
        else
            reject(new SlackApiError('', req.host + req.path));
    })

    res.on('error', err => {
        reject(err);
    })
}

module.exports.getSelfInfo = function(access_token) {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                host: AUTH_TEST_URL.hostname,
                path: AUTH_TEST_URL.pathname,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }

            let req = https.request(options, defaultResponseCallback);
            req.end();
        }
        catch(e) {
            throw(e);
        }
    });
}