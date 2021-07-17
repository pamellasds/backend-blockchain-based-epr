var path = require('path');
const neatCsv = require('neat-csv');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;


function generate_media_time(ini_size, operation) {

    //INICIA ARQUIVO
    var filename_timePublication = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
    const csvWriter = createCsvWriter({ path: filename_timePublication, append: true });
    const records = [['valores']];
    csvWriter.writeRecords(records).then(() => {console.log('...Done');});

    console.log("arquivo "+ ini_size+ ' '+ operation);

    for (let i = 1; i <= 30; i++) {

        //CAMINHO DO ARQUIVO PARA LEITURA
        var filename='';
        if (ini_size == 2000 || ini_size == 4000)  
            filename = path.join(__dirname, 'base_10_'+ini_size+'_inserir/base_64_10_'+(ini_size+1)+'_['+i+'].csv');
        else
            filename = path.join(__dirname, 'base_10_'+ini_size+'_inserir/base_64_10_'+ini_size+'_['+i+'].csv');
        
        var info;

        var soma_timePublication = 0;  var media_timePublication = 0;
        var soma_byteMedia = 0;  var media_byteMedia = 0;
        var soma_gas= 0;  var media_gas = 0;

        fs.createReadStream(path.join(__dirname,));
        fs.readFile(filename, async (err, data) => {
            if (err) {
            console.error(err)
            return
            }
            if (data)
                info = await neatCsv(data);      

                for (var j = 0; j < info.length; j++) {
                    var timePublication = parseInt(info[j].timePublication);
                    var byteMedia = parseInt(info[j].bytes_media);
                    var gasUsedTransaction = parseInt(info[j].gasUsedTransaction);

                    if (Math.sign(timePublication) == -1) timePublication = timePublication*(-1);
                

                    soma_timePublication = soma_timePublication + timePublication;
                    soma_byteMedia = soma_byteMedia + byteMedia;
                    soma_gas = soma_gas + gasUsedTransaction;
                }

                media_timePublication = Math.round(soma_timePublication/info.length);
                media_byteMedia = Math.round(soma_byteMedia/info.length);
                media_gas = Math.round(soma_gas/info.length);

                
                //ESCREVE MÉDIAS - TIME PUBLICATION
                var filename_timePublication = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
                const csvWriter = createCsvWriter({path: filename_timePublication,append: true}); 
                const records = [[media_timePublication]];
                csvWriter.writeRecords(records).then(() => {console.log('...Done');});

                soma_timePublication = 0;   media_timePublication = 0;
                soma_byteMedia = 0;   media_byteMedia = 0;
                soma_gas = 0;   media_gas = 0;

        })
    }
}

function generate_media_time_read(ini_size, operation) {

    //INICIA ARQUIVO
    var filename_timePublication = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
    const csvWriter = createCsvWriter({ path: filename_timePublication, append: true });
    const records = [['valores']];
    csvWriter.writeRecords(records).then(() => {console.log('...Done');});

    console.log("arquivo "+ ini_size+ ' '+ operation);

    for (let i = 1; i <= 30; i++) {

        //CAMINHO DO ARQUIVO PARA LEITURA
        var filename='';
        if (ini_size == 2000 || ini_size == 4000)  
            filename = path.join(__dirname, 'hash_50_'+ini_size+'_read/hash_50_'+(ini_size+1)+'_['+i+']_read.csv');
        else
            filename = path.join(__dirname, 'hash_50_'+ini_size+'_read/hash_50_'+ini_size+'_['+i+']_read.csv');
        
        var info;

        var soma_responseTime = 0;  var media_responseTime = 0;

        fs.createReadStream(path.join(__dirname,));
        fs.readFile(filename, async (err, data) => {
            if (err) {
            console.error(err)
            return
            }
            if (data)
                info = await neatCsv(data);      

                for (var j = 0; j < info.length; j++) {
                    var responseTime = parseInt(info[j].responseTime);
    
                    if (Math.sign(responseTime) == -1) responseTime = responseTime*(-1);
                
                    soma_responseTime = soma_responseTime + responseTime;

                    

                    console.log(soma_responseTime,i);
                }

                media_responseTime = Math.round(soma_responseTime/info.length);
                 
                //ESCREVE MÉDIAS - TIME PUBLICATION
                var filename_responseTime = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
                const csvWriter = createCsvWriter({path: filename_responseTime,append: true}); 
                const records = [[media_responseTime]];
                csvWriter.writeRecords(records).then(() => {console.log('...Done');});

                console.log("Média: "+media_responseTime, i);
                soma_responseTime = 0;   media_responseTime = 0;

        })
    }
}

function generate_memory(ini_size, operation) {
    //INICIA ARQUIVO
    var filename_timePublication = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
    const csvWriter = createCsvWriter({ path: filename_timePublication, append: true });
    const records = [['valores']];
    csvWriter.writeRecords(records).then(() => {console.log('...Done');});

    console.log("arquivo "+ ini_size+ ' '+ operation);

    for (let i = 1; i <= 30; i++) {

        //CAMINHO DO ARQUIVO PARA LEITURA
        var filename='';
        if (ini_size == 2000 || ini_size == 4000)  
            filename = path.join(__dirname, 'base_10_'+ini_size+'_inserir/base_64_10_'+(ini_size+1)+'_['+i+'].csv');
        else
            filename = path.join(__dirname, 'base_10_'+ini_size+'_inserir/base_64_10_'+ini_size+'_['+i+'].csv');
        
        var info;

        var soma_timePublication = 0;  var media_timePublication = 0;
        var soma_byteMedia = 0;  var media_byteMedia = 0;
        var soma_gas= 0;  var media_gas = 0;

        fs.createReadStream(path.join(__dirname,));
        fs.readFile(filename, async (err, data) => {
            if (err) {
            console.error(err)
            return
            }
            if (data)
                info = await neatCsv(data);      

                for (var j = 0; j < info.length; j++) {
                    //var timePublication = parseInt(info[j].timePublication);
                    var byteMedia = parseInt(info[j].bytes_media);
                    //var gasUsedTransaction = parseInt(info[j].gasUsedTransaction);

                    //if (Math.sign(timePublication) == -1) timePublication = timePublication*(-1);
                
                    //soma_timePublication = soma_timePublication + timePublication;
                    soma_byteMedia = soma_byteMedia + byteMedia;
                    //soma_gas = soma_gas + gasUsedTransaction;


                    //ESCREVE SOMATÓRIO - TIME PUBLICATION
                    var filename_byteMedia = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
                    const csvWriter = createCsvWriter({path: filename_byteMedia,append: true}); 
                    console.log(soma_byteMedia, j);
                    const records = [[j, soma_byteMedia]];
                    csvWriter.writeRecords(records).then(() => {console.log('...Done');});
                }

                //media_timePublication = Math.round(soma_timePublication/info.length);
                media_byteMedia = Math.round(soma_byteMedia/info.length);
                //media_gas = Math.round(soma_gas/info.length);

                
                //ESCREVE MÉDIAS - TIME PUBLICATION
                var filename = path.join(__dirname, 'medias/media_time_publication_'+ini_size+'_'+operation+'.csv');
                const csvWriter = createCsvWriter({path: filename,append: true}); 
                const records = [["Média "+i, media_byteMedia]];
                csvWriter.writeRecords(records).then(() => {console.log('...Done');});

                //soma_timePublication = 0;   media_timePublication = 0;
                soma_byteMedia = 0;   media_byteMedia = 0;
                //soma_gas = 0;   media_gas = 0;

        })
    }
}


generate_memory(1000, 'read');







         