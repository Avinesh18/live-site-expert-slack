const res = require('express/lib/response');

var _eventState = new Map();
module.exports._eventState = _eventState;

const {
    messageEvent,
    myMessageEvent,
    defaultMessageEvent,
    threadedMessageEvent,
    changedMessageEvent,
    threadedFileShareEvent,
    fileShareEvent,
    channelJoinEvent
} = require('./MessageEvents')

var { _installationDetails } = require('..//util/Installation');

async function URLVerification(req, res) {
    res.send({ challenge:  req.body.challenge });
    _eventState.set(req.body.event_id, 'DONE');
}

function defaultEvent(event) {
    console.log("Not a message event");  
    _eventState.set(event.event_id, 'DONE') 
}

async function EventCallback(event) {
    switch(event.event.type) {
        case 'message':
            console.log('type: message')
            console.log('subtype: ' + event.event.subtype);

            if(event.event.subtype == 'channel_join')
                channelJoinEvent(event)
            else if(event.event.bot_id == _installationDetails.get(event.event.team).bot_id)
                myMessageEvent(event);
            else if(event.event.subtype == "message_changed")
                changedMessageEvent(event);
            else if(event.event.subtype == "file_share") {
                if(event.event.thread_ts)
                    threadedFileShareEvent(event);
                else   
                    fileShareEvent(event);
            }
            else if(event.event.subtype)
                defaultMessageEvent(event);
            else if(event.event.thread_ts)
                threadedMessageEvent(event);
            else
                messageEvent(event);
        break;

        default:
            defaultEvent(event);
        break;
    }
}

async function defaultHandler(event) {
    console.log("Not a supported event type");
    _eventState.set(event.event_id, 'DONE');
}

module.exports.handleEvent = function(req, res) {
    if(_eventState.get(req.body.event_id))
    {
        //The event is being processed or done
        //This is a retransmission for this event
        return res.sendStatus(200);
    }

    _eventState.set(req.body.event_id, 'PROCESSING');
    switch(req.body.type) {
        case "url_verification":
            URLVerification(req, res);
        break;

        case "event_callback":
            EventCallback(req.body);
            return res.sendStatus(200);
        break;

        default:
            defaultHandler(req.body);
            return res.sendStatus(200);
        break;
    }
}