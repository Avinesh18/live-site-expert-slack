class SlackError extends Error {
    constructor(message) {
        super(message);
    }
}

class SlackApiError extends SlackError {
    constructor(message, href) {
        message = message || "";
        if(message.length)
            message += "\n";
        message += "for request to " + href;
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports.SlackApiError = SlackApiError;