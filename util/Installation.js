//An interface to store retrieve installation details

class Installation {
    constructor(team_id, user_id, bot_id, bot_user_token) {
        this.team_id = team_id;
        this.user_id = user_id;
        this.bot_id = bot_id;
        this.bot_user_token = bot_user_token;
    }
}

function createNewInstallation(team_id, user_id, bot_id, bot_user_token) {
    return new Installation(team_id, user_id, bot_id, bot_user_token)
}

var _installationDetails = new Map();

let n = process.env.N;

for(let i=1; i<=n; ++i) {
    let team_id = process.env[`TEAM_ID_${i}`];

    _installationDetails.set(team_id, {
        bot_user_token: process.env[`BOT_USER_TOKEN_${i}`],
        bot_id: process.env[`MY_BOT_ID_${i}`],
        user_id: process.env[`MY_USER_ID_${i}`]
    });
}

module.exports._installationDetails = _installationDetails;