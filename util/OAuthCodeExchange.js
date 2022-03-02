const https = require('https');
const FormData = require('form-data');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SLACK_OAUTH_URL = new URL("https://slack.com/api/oauth.v2.access");

// function callback(res) {
//     if(res.statusCode != 200)
//         _codeExchangeMap.set(code, 'FAILED');
    
//     res.on('data', async function(chunk) {
//         var data = JSON.parse(chunk.toString());
//         if(data.ok) {
//             _codeExchangeMap.set(code, 'STORING');
//             let self_data = await getSelfInfo(data.access_token)
//             storeSecurely(data.team.id, {
//                 'user_id': data.bot_user_id,
//                 'bot_user_token': data.access_token,
//                 'bot_id': self_data.bot_id
//             });
//             _codeExchangeMap.set(code, 'DONE');
//         }
//         else
//             _codeExchangeMap.set(code, 'FAILED');
//     })

//     res.on('error', err => {
//         _codeExchangeMap.set(code, 'FAILED');
//     })
// }

module.exports.getAccessToken1 = async function(code) {
    let form_data = new FormData();
    form_data.append('code', code);

    let headers = form_data.getHeaders();
    headers['Authorization'] = "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString('base64');
    console.log(headers);
    let options = {
        host: SLACK_OAUTH_URL.hostname,
        path: SLACK_OAUTH_URL.pathname,
        method: 'POST',
        headers: headers
    };

    let callback = function(res) {
        console.log("Get access token status code: " + res.statusCode);
        if(res.statusCode != 200)
            _codeExchangeMap.set(code, 'FAILED');
        
        res.on('data', async function(chunk) {
            var data = JSON.parse(chunk.toString());
            if(data.ok) {
                _codeExchangeMap.set(code, 'STORING');
                let self_data = JSON.parse(await getSelfInfo(data.access_token));
                console.log(self_data);
                storeSecurely(data.team.id, {
                    'user_id': data.bot_user_id,
                    'bot_user_token': data.access_token,
                    'bot_id': self_data.bot_id
                });
                _codeExchangeMap.set(code, 'DONE');
            }
            else
            {
                console.log(data);
                _codeExchangeMap.set(code, 'FAILED');
            }
        })

        res.on('error', err => {
            console.error(err);
            _codeExchangeMap.set(code, 'FAILED');
        })
    }
    let req = https.request(options, callback);
    form_data.pipe(req);
}

module.exports.getAccessToken = function(code) {
    return new Promise((resolve,reject) => {
        _codeExchangeMap.set(code, 'PROCESSING');

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
                let data = chunk.toString();
                if(data.ok) 
                    resolve(data.access_token);
                else   
                    reject(new Error(data.error));
            })

            res.on('error', err => {
                reject(error);
            })
        }

        let req = https.request(options, callback);
        form_data.pipe(req);
    });
}