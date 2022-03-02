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