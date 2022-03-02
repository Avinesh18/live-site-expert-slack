const e = require('express');
const { postMessageChannel, postMessageThread } = require('../util/PostMessage')
var { _eventState } = require('./EventsHandler')

module.exports.messageEvent = function (event) {
    let team = event.event.team;
    let channel = event.event.channel;
    let thread_ts = event.event.ts;

    let text = "Received Text: " + event.event.text;
    if(event.event.files)
        text += "\nFiles: " + event.event.files.map(e => e.name);

    postMessageThread(team, channel, text, thread_ts, false);
    _eventState.set(event.event_id, 'DONE');
}

module.exports.threadedMessageEvent = function(event) {
    console.log('thread event');
    let team = event.event.team;    
    let channel = event.event.channel;
    let thread_ts = event.event.thread_ts;

    let text = "Received Text: " + event.event.text;
    
    postMessageThread(team, channel, text, thread_ts, false);
    _eventState.set(event.event_id, 'DONE');
}

module.exports.fileShareEvent = function (event) {
    let team = event.event.team;
    let channel = event.event.channel;
    let thread_ts = event.event.ts;

    let text = "Received Text: " + event.event.text;
    text += "\nFiles: " + event.event.files.map(e => e.name);

    postMessageThread(team, channel, text, thread_ts, false);
    _eventState.set(event.event_id, 'DONE');
}

module.exports.threadedFileShareEvent = function(event) {
    let team = event.event.team;
    let channel = event.event.channel;
    let thread_ts = event.event.thread_ts;

    let text = "Received Text: " + event.event.text;
    text += "\nFiles: " + event.event.files.map(e => e.name);

    postMessageThread(team, channel, text, thread_ts, false);
    _eventState.set(event.event_id, 'DONE');
}

module.exports.myMessageEvent = function (event) {
    console.log("This message was sent by me.");
    _eventState.set(event.event_id, 'DONE');
}

module.exports.deletedMessageEvent = function (event) {

    console.log("MESSAGE DELETED: " + event.previous_message.client_message_id);
    _eventState.set(event.event_id, 'DONE');
}

// A message was changed to a new message
module.exports.newMessageEvent = function(event) {
    console.log("New Message Created");
    _eventState.set(event.event_id, 'DONE');
}

module.exports.changedMessageEvent = function(event) {
    console.log("MESSAGE CHANGED");
    console.log("PREVIOUS MESSAGE: " + event.event.previous_message.text);
    console.log("NEW MESSAGE: " + event.event.message.text);
    console.log("Previous Message User: " + event.event.previous_message.user + ", New Message User:" + event.event.message.user);
    console.log("Previous Message thread_ts: " + event.event.previous_message.thread_ts + ", New Message thread_ts: " + event.event.message.thread_ts);
    console.log("New Message Subtype: " + event.event.message.subtype);

    switch(event.event.message.subtype) {
        case 'tombstone':
            this.deletedMessageEvent(event);
        break;

        case 'message':
            this.newMessageEvent(event);
        break;
    }
}

module.exports.defaultMessageEvent = function (event) {
    console.log("Event subtype: " + event.event.subtype);
    _eventState.set(event.event_id, 'DONE');
}

module.exports.channelJoinEvent = function (event) {
    console.log("USER: " + event.event.user + " joined CHANNEL: " + event.event.channel);
    _eventState.set(event.event_id, 'DONE');
}