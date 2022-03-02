const https = require('https');
const FormData = require('form-data');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SLACK_OAUTH_URL = new URL("https://slack.com/api/oauth.v2.access");

module.exports.getAccessToken = function(code) {
    return new Promise((resolve,reject) => {

        let form_data = new FormData();
        form_data.append('code', code);

        let headers = form_data.getHeaders();
        headers['Authorization'] = "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString('base64');

        let options = {
            host: SLACK_OAUTH_URL.hostname,
            path: SLACK_OAUTH_URL.pathname,
            method: 'POST',
            headers: headers
        };

        let callback = function(res) {
            if(res.statusCode != 200) {
                reject(new Error('Status Code: ' + res.statusCode));
            }

            res.on('data', chunk => {
                let data = JSON.parse(chunk.toString());
                if(data.ok) 
                    resolve(data.access_token);
                else
                {
                    console.log(data);  
                    reject(new Error(data.error));
                }
            })

            res.on('error', err => {
                reject(error);
            })
        }

        let req = https.request(options, callback);
        form_data.pipe(req);
    });
}