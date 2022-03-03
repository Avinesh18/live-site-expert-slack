
module.exports.storeSecurely = async function(key, value) {
    //Need to configure a valut

    console.log('ADD TO .ENV');
    console.log('team_id: ' + key);
    console.log('user_id: ' + value.user_id);
    console.log('bot_user_token: ' + value.bot_user_token);
    console.log('bot_id: ' + value.bot_id);
}