const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const fs = require('fs');


function writeCSVAll(idRegister, idUser, startInsertTime, endInsertTime, timePublication, transactionHash, 
    blockHash, blockNumber, gasUsedTransaction, gasUsedBlock,size, bytes_media, timestamp, numberTransactions,
    count, reqs, ini_size){
        const csvWriter = createCsvWriter({
            header: ['idRegister', 'idUser', 'startInsertTime', 'endInsertTime', 'timePublication',
            'transactionHash', 'blockHash', 'blockNumber', 'gasUsedTransaction', 'gasUsedBlock',
            'size', 'bytes_media', 'timestamp', 'numberTransactions'],
            path: 'base_64'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']'+'.csv',//all_results.csv'
            append: true
        });
         
        const records = [
            [idRegister, idUser, startInsertTime, endInsertTime, timePublication, transactionHash, blockHash, blockNumber, gasUsedTransaction, gasUsedBlock,size, bytes_media, timestamp, numberTransactions],
        ];
         
        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
}

function writeCSVHash(idRegister, idUser, startInsertTime, endInsertTime, timePublication, transactionHash, 
    blockHash, blockNumber, gasUsedTransaction, gasUsedBlock,size, bytes_media, timestamp, numberTransactions,
    count, reqs, ini_size, timePublicationBDD){
        const csvWriter = createCsvWriter({
            header: ['idRegister', 'idUser', 'startInsertTime', 'endInsertTime', 'timePublication',
            'transactionHash', 'blockHash', 'blockNumber', 'gasUsedTransaction', 'gasUsedBlock',
            'size', 'bytes_media', 'timestamp', 'numberTransactions', 'timePublicationBDD'],
            path: 'hash'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']'+'.csv',//all_results.csv'
            append: true
        });
         
        const records = [
            [idRegister, idUser, startInsertTime, endInsertTime, timePublication, 
            transactionHash, blockHash, blockNumber, gasUsedTransaction, gasUsedBlock,
            size, bytes_media, timestamp, numberTransactions, timePublicationBDD],
        ];
         
        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
}

function writeRequest(idRegister, idUser, responseTime, count, reqs, ini_size){
        const csvWriter = createCsvWriter({
            header: ['idRegister', 'idUser', 'responseTime'],
            path: 'hash'+'_'+reqs+'_'+ini_size+'_'+'['+(count+1)+']_read'+'.csv',//all_results.csv'
            append: true
        });
         
        const records = [
            [idRegister, idUser, responseTime],
        ];
         
        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('...Done ');
            });
}

module.exports = {writeCSVAll, writeCSVHash, writeRequest}

/**
 * 

var fs = require('fs');
var json2csv = require('json2csv');
var newLine = '\r\n';



function writeCSV(idRegister, idUser, startInsertTime, endInsertTime, timePublication, transactionHash, 
    blockHash, blockNumber, gasUsedTransaction, gasUsedBlock,size, timestamp, numberTransactions){
    var fields = ['idRegister', 'idUser', 'startInsertTime', 'endInsertTime', 'timePublication',
        'transactionHash', 'blockHash', 'blockNumber', 'gasUsedTransaction', 'gasUsedBlock',
        'size', 'timestamp', 'numberTransactions'];

    var appendThis = [
        {
            idRegister: idRegister,
            idUser: idUser,
            startInsertTime: startInsertTime,
            endInsertTime: endInsertTime,
            timePublication: timePublication,
            transactionHash: transactionHash,
            blockHash: blockHash,
            blockNumber: blockNumber,
            gasUsedTransaction: gasUsedTransaction,
            gasUsedBlock: gasUsedBlock,
            size: size,
            timestamp: timestamp,
            numberTransactions: numberTransactions
        }];

    var toCsv = {
    data: appendThis,
    fields: fields,
    header: false,
    };

    fs.stat('insert_register.csv', function (err, stat) {
    if (err == null) {
    console.log('File exists');

    //write the actual data and end with newline
    var csv = json2csv(toCsv) + newLine;

    fs.appendFile('insert_register.csv', csv, function (err) {
    if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    } else {
    //write the headers and newline
    console.log('New file, just writing headers');
    fields = fields + newLine;

    fs.writeFile('insert_register.csv', fields, function (err) {
    if (err) throw err;
        console.log('file saved');
    });
    }
    });
}
 */