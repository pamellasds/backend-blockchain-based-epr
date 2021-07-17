var bodyParser = require('body-parser')
const express = require('express');
const morgan = require('morgan'); //For terminal/console request logging
const helmet = require('helmet'); // Protect app from some web vulnerabilities
var cors = require('cors');
var server = null;
const PORT =5000;


function start(api, callback) {
    const app = express();

    app.use(morgan('dev')); 
    app.use(helmet());
    app.use((err, req, res, next) => {
        callback(new Error('Something went wrong!'));
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

        next();
    })

    app.use(cors());
   // app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json({limit: '10mb', extended: true}))
    app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 200000 }))


    api(app);

    server = app.listen(process.env.PORT || parseInt(PORT),
    () => callback(null, server));
}

function stop() {
    if(server) server.close();
    return true;
}

module.exports = {start, stop}
