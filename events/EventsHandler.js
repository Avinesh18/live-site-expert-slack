const { postMessageChannel } = require('../util/PostMessage')

const MY_BOT_ID = process.env.MY_BOT_ID

function URLVerification(req, res) {
    return res.send({ challenge:  req.body.challenge });
}

function messageEvent(event) {
    let channel = event.event.channel;
    let text = "Received Text: " + event.event.text;
    if(event.event.files)
        text += "\nFiles: " + event.event.files.map(e => e.name);

    postMessageChannel(text, channel);
}

function botMessageEvent(event) {
    if(event.event.bot_id == MY_BOT_ID)
        return
    messageEvent(event)
}

function deleteMessageEvent(event) {

}

function defaultMessageEvent(event) {

}

function defaultEvent(event) {
    
}

async function Event(event) {
    switch(event.event.type) {
        case 'message':
            if(!event.event.subtype)
                messageEvent(event);
            else if(event.event.subtype == 'bot_message')
                botMessageEvent(event);
            else if(event.event.subtype == 'message_deleted')
                deleteMessageEvent(event);
            else
                defaultMessageEvent(event);
        break;

        default:
            defaultEvent(event);
        break;
    }
}

async function defaultHandler(event) {
    
}

module.exports = function(req, res) {
    switch(req.body.type) {
        case "url_verification":
            URLVerification(req, res);
        break;

        case "event_callback":
            Event(req.body);
            return res.sendStatus(200);
        break;

        default:
            defaultHandler(req.body);
            return res.sendStatus(200);
        break;
    }
}