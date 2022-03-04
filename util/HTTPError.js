class HTTPError extends Error {
    /*
    * options: (optional) Contains host, path, and method
    */
    constructor(message, options) {
        message = message || "";
        if(this.options.host || this.options.path || this.options.method) {
            if(message.length)
                message += "\n";
            message += "for";
            if(this.options.host)
                message += " HOST: " + this.options.host;
            if(this.options.path)
                message += " PATH: " + this.options.path;
            if(this.options.method)
                message += " METHOD: " + this.options.method
        }
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

class HTTPStatusCodeError extends HTTPError {
    constructor(message, options, statusCode) {
        message = message || "";
        if(statusCode != undefined) {
            if(message.length)
                message += "\n";
            message += "Response status code: " + statusCode;
        }
        super(message, options);

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports.HTTPError = HTTPError;
module.exports.HTTPStatusCodeError = HTTPStatusCodeError;