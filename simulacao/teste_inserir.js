'use strict'

const connect = require('../config/connectionBlockchain');
const connectWeb3 = require('../config/connectionWeb3')
const createCSV = require('./createCSV')
var moment = require('moment')
const {Client} = require('cassandra-driver');
var moment = require('moment')

var path = require('path');
const neatCsv = require('neat-csv');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const find = require('find-process');
var pidusage = require('pidusage')


var crypto = require('crypto');

var count = 0;

function sleep(delay) {
	var timestamp = Date.now();
	while(Date.now() - timestamp <= delay); 
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result+'=';
}

/**
 * ini_size: 1000, 2001, 4001
 * final_size: 2000, 4000, 7000
 * reqs: 1, 10, 100, 1000 
 */
async function execute_base64(ini_size, final_size, reqs, count){
    console.log("EXECUÇÃO: ", count);

    var memory_usage = 0;
    var cpu_usage = 0;
    //INICIA ARQUIVO

    var filename = path.join(__dirname, 'base_64_'+reqs+'_'+ini_size+'_['+(count+1)+'].csv');
    const csvWriter = createCsvWriter({ path: filename, append: true });
    const records = [['idRegister', 'idUser', 'startInsertTime', 'endInsertTime', 'timePublication',
    'transactionHash', 'blockHash', 'blockNumber', 'gasUsedTransaction', 'gasUsedBlock',
    'size', 'bytes_media', 'timestamp', 'numberTransactions']];
    csvWriter.writeRecords(records).then(() => {console.log('...Done');});

    for (let i = 0; i < reqs; i++) {
        sleep(125); // Sleep for 125 miliseconds
        const idRegister = getRandomInt(1000,3000)
        const idUser = getRandomInt(3001,6000)
        const idPS = getRandomInt(6001,9000)
        const media_base64 = makeid(getRandomInt(ini_size,final_size));

        var bytes_media = Buffer.byteLength(media_base64, 'utf8');
            
        const linkRegister = media_base64; 	// This variable storage a base64 format of the file.
    
        //Check if there is a given record
        let checkRecord = await connect.connectContractRead().checkRecordOwner(idRegister, idUser);

        try { 
            if (checkRecord == true) {
                console.log("Record with the same ID already registered to Patient!");
            } else {
                var firstTimeChain = moment();//new Date();
                connectWeb3.instance.methods.insertOwner(idRegister, idUser, idPS, linkRegister).send({
                    from: '0x633D3B8d5e10500CFc1cA3a5928A1Ce03d1C945C',
                    gas: 9999999,
                }).then((record) =>{
                /*
                    //Memory Usage
                    find('name', 'Ganache.exe')
                    .then(function (list) {
                      for (let index = 0; index < list.length; index++) {
                        pidusage(list[index].pid, function (err, stats) {
                                memory_usage = memory_usage + stats.memory;
                                cpu_usage = cpu_usage + stats.cpu;
                        })
                      }
                      var filename = path.join(__dirname, 'memory_base'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']_read'+'.csv');
                        const csvWriter = createCsvWriter({ path: filename, append: true });
                        const records = [[memory_usage, cpu_usage]];
                        csvWriter.writeRecords(records).then(() => {console.log('...ARQUIVO CRIADO');}); 
                      memory_usage=0; cpu_usage=0;
                    }, function (err) {
                      console.log(err.stack || err);
                    })*/

                    connectWeb3.web3.eth.getBlock(record.blockNumber).then(function(block_info) {	
                        var secondTimeChain2 = moment.unix(block_info.timestamp);
                    
                        var timeDifference2 = secondTimeChain2.diff(firstTimeChain, 'milliseconds')
    
                        createCSV.writeCSVAll(idRegister, idUser, firstTimeChain.format('MMMM Do YYYY, h:mm:ss.SSS'), 
                        secondTimeChain2.format('MMMM Do YYYY, h:mm:ss.SSS'), timeDifference2,	record.transactionHash, 
                        record.blockHash, record.blockNumber, record.gasUsed.toString(), block_info.gasUsed.toString(),
                        block_info.size, bytes_media, block_info.timestamp, block_info.transactions.length, count,
                        reqs, ini_size);

                    });
                    console.log("Record successfully registered! REQUISIÇÃO: ", i);
                });
            
            }         
        } catch (err) {
            console.log('Error registering record! ERROR: ' + err.message + "." )
        }
    }
}

async function execute_hash(ini_size, final_size, reqs, count){
    //INICIA ARQUIVO
    var memory_usage = 0;
    var cpu_usage = 0;

    var filename = path.join(__dirname, 'hash_'+reqs+'_'+ini_size+'_['+(count+1)+'].csv');
    const csvWriter = createCsvWriter({ path: filename, append: true });
    const records = [['idRegister', 'idUser', 'startInsertTime', 'endInsertTime', 'timePublication',
    'transactionHash', 'blockHash', 'blockNumber', 'gasUsedTransaction', 'gasUsedBlock',
    'size', 'bytes_media', 'timestamp', 'numberTransactions']];
    csvWriter.writeRecords(records).then(() => {console.log('...Done');});

//async function execute_hash(){
    const client = new Client({
        cloud: { secureConnectBundle: 'secure-connect-medical-record.zip' },
        credentials: { username: 'pamella', password: '06012017Pedro' },
        keyspace: 'medical_record'
    });

    for (let i = 0; i < reqs; i++) {
        sleep(125); // Sleep for 125 miliseconds
        const idRegister = getRandomInt(1000,3000).toString()
        const idUser = getRandomInt(3001,4000).toString() //patient -> posse
        const idPS =   getRandomInt(4001,6000).toString()
        const media_base64 = makeid(getRandomInt(ini_size,final_size));
        const linkRegister = crypto.createHash('sha256')
                      .update(media_base64)
                       .digest('hex');
        
        var bytes_media = Buffer.byteLength(linkRegister, 'utf8');

    
        //Check if there is a given record
        let checkRecord = await connect.connectContractRead().checkRecordOwner(idRegister, idUser);
    
        try {
            if (checkRecord == true) {
                console.log('Record with the same ID already registered to Patient!');          
            } else {
            
            var firstTimeChain_bdd = moment();//new Date();
            await client.connect();
    
            const params = [idRegister, idUser, idPS, Date.now(), media_base64];
            const query = 'INSERT INTO medical_record (register_id, patient_id, ps_id, data, media_base64) VALUES (?, ?, ?, ?, ?)';
            
            
            await client.execute(query, params, { prepare: true }); 
            console.log("Foi!");
    
            var firstTimeChain_bc = moment();//new Date();
            connectWeb3.instance.methods.insertOwner(idRegister, idUser, idPS, linkRegister).send({
              from: '0x633D3B8d5e10500CFc1cA3a5928A1Ce03d1C945C',
              gas: 9999999,
            }).then((record) =>{
                /*Memory Usage
                find('name', 'Ganache.exe')
                .then(function (list) {
                  for (let index = 0; index < list.length; index++) {
                    pidusage(list[index].pid, function (err, stats) {
                            memory_usage = memory_usage + stats.memory;
                            cpu_usage = cpu_usage + stats.cpu;
                    })
                  }
                  var filename = path.join(__dirname, 'memory_hash'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']_read'+'.csv');
                    const csvWriter = createCsvWriter({ path: filename, append: true });
                    const records = [[memory_usage, cpu_usage]];
                    csvWriter.writeRecords(records).then(() => {console.log('...ARQUIVO CRIADO');}); 
                  memory_usage=0; cpu_usage=0;
                }, function (err) {
                  console.log(err.stack || err);
                })*/
                connectWeb3.web3.eth.getBlock(record.blockNumber).then(function(block_info) {	
                    var secondTimeChain_bc = moment.unix(block_info.timestamp);
                    var secondTimeChain_bdd = moment();
                    var timeDifference_bc = secondTimeChain_bc.diff(firstTimeChain_bc, 'milliseconds')
                    var timeDifference_bdd = secondTimeChain_bdd.diff(firstTimeChain_bdd, 'milliseconds')
                    console.log(block_info);  
                    createCSV.writeCSVHash(idRegister, idUser, firstTimeChain_bc.format('MMMM Do YYYY, h:mm:ss.SSS'), 
                    secondTimeChain_bc.format('MMMM Do YYYY, h:mm:ss.SSS'), timeDifference_bc,	record.transactionHash, 
                    record.blockHash, record.blockNumber, record.gasUsed.toString(), block_info.gasUsed.toString(),
                    block_info.size, bytes_media, block_info.timestamp, block_info.transactions.length, count,
                    reqs, ini_size, timeDifference_bdd);

                    
                    
                });
                console.log("Record successfully registered! REQUISIÇÃO: ", i+1);
                
            });
            }
    
        } catch (err) {
        console.log('Error registering record! ERROR: ' + err.message + ".")
        }

    }

    await client.shutdown(); 

    return reqs;
}

async function read_base(ini_size, reqs, count){

//INICIA ARQUIVO

var filename = path.join(__dirname, 'base'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']_read'+'.csv');
const csvWriter = createCsvWriter({ path: filename, append: true });
const records = [['idRegister', 'idUser', 'responseTime']];
csvWriter.writeRecords(records).then(() => {console.log('...ARQUIVO CRIADO');});

/**
 * LEITURA DE ARQUIVOS
 */


 var filename = path.join(__dirname, 'base_'+reqs+'_2000_inserir/base_64_'+reqs+'_'+ini_size+'_['+(count+1)+'].csv');
 //var filename = path.join(__dirname, 'base_10_2000_inserir/base_64_10 _2001_[2] .csv');
 var ids;

 var idRegister;
 var idUser;

 fs.createReadStream(path.join(__dirname,));
 fs.readFile(filename, async (err, data) => {
     if (err) {
         console.error(err)
         return
     }
     if (data) 
         ids = await neatCsv(data);

     //console.log(ids);

     for (var j = 0; j < ids.length; j++) {
         idRegister = ids[j].idRegister
         idUser = ids[j].idUser  

         try {
             //let documentsList = await connect.connectContractRead().getAllDocumentBlockchain();
             var firstTimeChain = moment();//new Date();
             let response = await connect.connectContractRead().readRecord(idRegister, idUser);

             if(response)
                 var secondTimeChain = moment();
             
             var responseTime = secondTimeChain.diff(firstTimeChain, 'milliseconds')

             createCSV.writeRequest(idRegister, idUser, responseTime, count, reqs, ini_size);
             console.log(j+1);
         } catch (e) {
             console.log({ "success": false, "message": 'Error registering document! ERROR: ' + e.message + "." })
         }
     }

 })
}

async function read_base_hash(ini_size, reqs, count){
    //INICIA ARQUIVO
    
    var filename = path.join(__dirname, 'hash'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']_read'+'.csv');
    const csvWriter = createCsvWriter({ path: filename, append: true });
    const records = [['idRegister', 'idUser', 'responseTime']];
    csvWriter.writeRecords(records).then(() => {console.log('...ARQUIVO CRIADO');});
    
    /**
     * LEITURA DE ARQUIVOS
     */
    
    
     var filename = path.join(__dirname, 'hash_'+reqs+'_2000_inserir/hash_'+reqs+'_'+ini_size+'_['+(count+1)+'].csv');
     //var filename = path.join(__dirname, 'base_10_2000_inserir/base_64_10 _2001_[2] .csv');
     var ids;
    
     var idRegister;
     var idUser;
    
     fs.createReadStream(path.join(__dirname,));
     fs.readFile(filename, async (err, data) => {
         if (err) {
             console.error(err)
             return
         }
         if (data) 
             ids = await neatCsv(data);
    
         //console.log(ids);
    
    for (var j = 0; j < ids.length; j++) {
        idRegister = ids[j].idRegister
        idUser = ids[j].idUser  

        const client = new Client({
        cloud: { secureConnectBundle: 'secure-connect-medical-record.zip' },
        credentials: { username: 'pamella', password: '06012017Pedro' },
        keyspace: 'medical_record'
        });
        
            
    await client.connect();

    var firstTimeChain = moment();
    const register = await client.execute(`SELECT register_id, patient_id, ps_id, data, media_base64 FROM medical_record WHERE register_id = '${idRegister}'`);
    
    await client.shutdown();

    if(register)
        var secondTimeChain = moment();
            
    var responseTime = secondTimeChain.diff(firstTimeChain, 'milliseconds')

    createCSV.writeRequest(idRegister, idUser, responseTime, count, reqs, ini_size);
    console.log(j+1, responseTime);
 
         }
    
     })
}

var list_reqs = [1, 10, 50];


/**
 * EXECUÇÕES COM O ARQUIVO NO FORMATO BASE 64 - ESCRITA
*/

 
//execute_base64(1000,2001,list_reqs[1], 0)  
//execute_base64(2001,4000,list_reqs[0], index)       
//execute_base64(4001,7000,list_reqs[0], index)        

//execute_base64(1000,2001,list_reqs[1], 30)     
//execute_base64(2001,4000,list_reqs[1], 29)       
//execute_base64(4001,7000,list_reqs[1], 29) 

//execute_base64(1000,2001,list_reqs[2], 29)         
//**execute_base64(2001,4000,list_reqs[2], 29)        
//execute_base64(4001,7000,list_reqs[2], index)      

/**
 * EXECUÇÕES COM HASH - ESCRITA
 */

//for (let index = 0; index < 30; index++) {   execute_hash(1000,2001,list_reqs[0], index)}         
//for (let index = 0; index < 30; index++) {  execute_hash(2001,4000,list_reqs[0], index)}       
//for (let index = 0; index < 30; index++) {  execute_hash(4001,7000,list_reqs[0], index)}  

execute_hash(1000,2000,list_reqs[1], 0)    
//execute_hash(2001,4000,list_reqs[1], 29)     
//execute_hash(4001,7000,list_reqs[1], 29)  

//execute_hash(1000,2001,list_reqs[2], 29)
//execute_hash(2001,4000,list_reqs[2], 4) 

//for (let index = 0; index < 30; index++) {  execute_hash(1000,2001,list_reqs[2], index)}         
//for (let index = 0; index < 30; index++) {  execute_hash(2001,4000,list_reqs[2], index)}        
//for (let index = 0; index < 30; index++) {  execute_hash(4001,7000,list_reqs[2], index)}  



/**
 * EXECUÇÕES COM O ARQUIVO NO FORMATO BASE 64 - LEITURA
*/

//*read_base(1000, list_reqs[1],29);
//*read_base(2001, list_reqs[1],29);
//*read_base(4001, list_reqs[1],29);

//read_base(1000, list_reqs[2],29);
//read_base(2001, list_reqs[2],4);



//*read_base_hash(1000, list_reqs[1],29);
//read_base_hash(2001, list_reqs[1],4);
//*read_base_hash(4001, list_reqs[1],29);

//read_base_hash(1000, list_reqs[2],29);
//read_base_hash(2001, list_reqs[2],29);
