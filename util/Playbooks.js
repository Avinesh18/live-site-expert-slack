const https = require('https');

var _playbookPath = new Map();

function loadPlaybookPaths() {
    let playbooks = process.env.PLAYBOOKS;

    for(let i = 1; i <= playbooks; ++i) {
        let channel = process.env[`CHANNEL_${i}`];
        let path = process.env[`PATH_${i}`];

        console.log("CHANNEL: " + channel + " PATH: " + path);

        _playbookPath.set(channel, path);
    }
}
loadPlaybookPaths();

const RAW_GITHUB_HOST = 'raw.githubusercontent.com'
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

module.exports.getPlaybookQuery = function(channel, alert) {
    console.log('Playbook Path: ' + _playbookPath.get(channel));
    return new Promise((resolve, reject) => {
        let options = {
            host: RAW_GITHUB_HOST,
            path: '/' + _playbookPath.get(channel) + '/' + alert,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + GITHUB_ACCESS_TOKEN
            }
        }

        let callback = function(res) {
            if(res.statusCode != 200) {
                console.log("Fetching playbook query returned status code: " + res.statusCode);
                reject(new Error('Status Code: ' + res.statusCode));
            }

            res.on('data', chunk => {
                resolve(chunk.toString());
            })

            res.on('error', err => {
                console.log("RES ERROR");
                console.error(err);
                reject(err);
            })
        }

        let req = https.request(options, callback);
        req.end();
    });
}