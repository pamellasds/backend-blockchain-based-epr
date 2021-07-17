const registros = require('./api/registerRecord');
//const registros = require('./api/registerRecordWeb3');
const server = require("./server/server");
 
server.start(registros, (err, app) => { 
    console.log('--- Service Connected ---')
});
