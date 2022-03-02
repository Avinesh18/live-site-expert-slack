var express = require('express');
require('dotenv').config();

//Add tokens to map
var _teamTokenMap

var HTTP_PORT = process.env.PORT | 8080;

var app = express();

app.use((req, res, next) => {
    console.log()
    console.log(new Date().toString());
    console.log(req.path)
    console.log("@" + req.method)
    next();
})
app.use(express.json())

app.use('/events', require('./events/events.js'));
app.use('/auth', require('./auth/auth'))

app.get('*', (req, res) => {
    console.log(req.path);
    return res.send('Live Site Expert');
})

app.listen(HTTP_PORT, error => {
    if(error)
        console.log("Cannot start server: " + ERROR)
    else
        console.log("Server started, PORT: " + HTTP_PORT);
});