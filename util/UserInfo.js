const { rejects } = require('assert');
const https = require('https');
const { resolve } = require('path');

const AUTH_TEST_URL = new URL("https://slack.com/api/auth.test");

module.exports.getSelfInfo = function(access_token) {
    return new Promise((resolve, reject) => {
        let options = {
            host: AUTH_TEST_URL.hostname,
            path: AUTH_TEST_URL.pathname,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        }

        let callback = res => {
            if(res.statusCode != 200)
            {
                reject(new Error('Status Code: ' + res.statusCode));
            }

            res.on('data', chunk => {
                resolve(chunk.toString());
            })

            res.on('error', err => {
                reject(err);
            })
        }

        let req = https.request(options, callback);
        req.end();
    });
}