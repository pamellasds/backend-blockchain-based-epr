'use strict'

const connect = require('../config/connectionBlockchain');
const connectWeb3 = require('../config/connectionWeb3')
const createCSV = require('../simulacao/createCSV')
const ethers = require('ethers');
const {Client} = require('cassandra-driver');
var moment = require('moment')

var crypto = require('crypto');

module.exports = (app) => {

	/**
	 * This route storage a file in base64 format in a distributed database. 
	 * Only md5 format is storaged on the blockchain.
	 */

	 app.post('/insert_register/', async (req, res) => {

		const client = new Client({
			cloud: { secureConnectBundle: 'api/secure-connect-pepchain.zip' },
			credentials: { username: 'pamella.soaresds@gmail.com', password: 'ommited for public' },
			keyspace: 'pepchain'
		});
	

		const idRegister = req.body.idRegister
		const idPatient = req.body.idPatient //patient -> posse
		const privateKey = 'ommited for public'
		const idPS =   req.body.idPS
		const media_base64 = req.body.media_base64 
		const arquivoHash = crypto.createHash('sha256')
  					.update(media_base64)
   					.digest('hex');

		console.log(
			"idRegister: " +  idRegister,
			"idPatient: " +  idPatient,
			"idPS: " +  idPS,
			"media_base64: " +  media_base64,
		);
		
		if (!idRegister || !idPatient || !idPS || !media_base64) //!arquivoHash || || !privateKey
			return res.send({ "success": false, "message": 'Some field is empty!' });

		//Check if there is a given record
		let checkRecord = await connect.connectContractRead().checkRecordOwner(idRegister, idPatient);

		try {
			if (checkRecord == true) {
				return res.send({ "success": false, "message": 'Record with the same ID already registered to Patient!' });          
			} else {

			await client.connect();

            const params = [idRegister, idPatient, idPS, Date.now(), media_base64];
            const query = `INSERT INTO pepchain (register_id, patient_id, ps_id, date, media_base64) 
						   VALUES (?, ?, ?, ?, ?)`;
            
			await client.execute(query, params, { prepare: true }); 
    
            await client.shutdown();
			
				var firstTimeChain = moment();
				var options = {
					gasLimit: 9999999,
					gasPrice: ethers.utils.parseUnits('220', 'gwei'),
				}

				connect.connectContractWrite(privateKey).insertOwner(idRegister, idPatient, idPS, arquivoHash, options).then((record) =>{
					connect.provider.waitForTransaction(record.hash).then((receipt) => {
						var secondTimeChain = moment();
						var timeDifference = secondTimeChain.diff(firstTimeChain, 'seconds')
						if(receipt.status == 0){
							return res.send({ "success": false, "message": 'Error registering record!'})
						}else{        
							connectWeb3.web3.eth.getBlock(receipt.blockNumber).then(function(block_info) {
								createCSV.writeCSVHash(idRegister, idPatient, firstTimeChain.format(), secondTimeChain.format(), timeDifference,
								receipt.transactionHash, receipt.blockHash, receipt.blockNumber, receipt.gasUsed.toString(), block_info.gasUsed.toString(),
								block_info.size, block_info.timestamp, block_info.transactions.length, 'hash')
							});
                            return res.send({ "success": true, "message": 'Record successfully registered!'})  //,"log_blockchain": record, "log_bdd": result
		             }					
					});
				});
			}

		} catch (err) {
			console.log(err);
			res.send({ "success": false, "message": 'Error registering record! ERROR: ' + err.info + "." })
		}
	}),	

	app.post('/read_register/', async (req, res) => {

		const client = new Client({
			cloud: { secureConnectBundle: 'api/secure-connect-pepchain.zip' },
			credentials: { username: 'pamella.soaresds@gmail.com', password: 'ommited for public' },
			keyspace: 'pepchain'
		});

		const idRegister = req.body.idRegister
		const idUser = req.body.idUser
		const idTypeUser = req.body.idTypeUser

		console.log(
			"idRegister: " +  idRegister,
			"idUser: " +  idUser,
			"idTypeUser: " +  idTypeUser
		);

		if (!idRegister || !idUser)
			return res.json({ "success": false, "message": 'Some field is empty!'});

		try {

			//Check if there is a given record that belongs to a patient or if someone entity has access
			let checkRecordPatient = await connect.connectContractRead().checkRecordOwner(idRegister.toFixed(), idUser.toFixed());
			console.log(checkRecordPatient)
			let checkRecordEntity = await connect.connectContractRead().checkAccess(idRegister.toFixed(), idUser.toFixed());
			console.log(checkRecordEntity)

			if (!checkRecordEntity && (idTypeUser == 0)){ //Health Entity
				res.json({ "success": false, "message": "User " + idUser + " does not access to the record " + idRegister+"!" });
			} else if (!checkRecordPatient && (idTypeUser == 1)){ //Patient
				res.json({ "success": false, "message": "This record don\'t belong to this patient!" });
			} else{
				await client.connect();

				const register = await client.execute(`SELECT register_id, patient_id, ps_id, date, 
				media_base64 FROM pepchain WHERE register_id = '${idRegister}'`);
				
				await client.shutdown();

				if(!register.rows.length)
					return res.send({"success": false, "message": "Record "+idRegister+" not registered", "result": register.rows});
				else
					return res.send({"success": true, "register": register.rows[0]});
			}
				
		} catch (e) {
			res.send({ "success": false, "message": 'Error registering document! ERROR: ' + e.message + "." })
		}
	}),


	/**
	 * Allow Access Request
	 * In this request, it will authorizes access a specific entity of blockchain.
	 */

	app.post('/allow_access/', async (req, res) => {
		const idRegister = req.body.idRegister
		const idPatient = req.body.idPatient // owner of the record
		const idUser = req.body.idUser // third-party that will access the record
		const privateKey = 'ommited for public'

		if (!idRegister || !idUser || !idPatient) //|| !privateKey
			return res.send({ "success": false, "message": 'Some field is empty!' });

		console.log(
			"idRegister: " +  idRegister,
			"idPatient: " +  idPatient,
			"idUser: " +  idUser,
		);

		//Check if there is a given record
		let checkRecordPatient = await connect.connectContractRead().checkRecordOwner(idRegister, idPatient);
		let checkRecordEntity = await connect.connectContractRead().checkAccess(idRegister, idUser);

		try {
			if(checkRecordEntity)
				return res.send({ "success": false, "message": 'This entity already has access to the record ' +  idRegister});

			
			if (!checkRecordPatient) {
				return res.send({ "success": false, "message": 'This record don\'t belong to this patient!' });
			} else {
				var options = {
					gasLimit: 9999999,
					gasPrice: ethers.utils.parseUnits('220', 'gwei')
				}
				connect.connectContractWrite(privateKey).allowAccess(idRegister, idUser, options).then((access) =>{
					console.log("Acesso: " + access);
					connect.provider.waitForTransaction(access.hash).then((receipt) => {
						if(receipt.status == 0){
							res.send({ "success": false, "message": 'Error registering access!'})
						}else{
							res.send({ "success": true, "message": 'Access successfully registered!'})
		 }					
		 console.log(receipt+"teste");
					});
				})

			}
		} catch (err) {
			res.send({ "success": false, "message": 'Error registering record! ERROR: ' + err.message + "." })
		}
	}),


	/**
	 * Deny Access Rquest
	 * In this request, it will disallows access a specific entity of blockchain.
	 */

	 app.post('/deny_access/', async (req, res) => {
		const idRegister = req.body.idRegister
		const idPatient = req.body.idPatient // owner of the record
		const idUser = req.body.idUser // third-party that will access the record
		const privateKey = 'ommited for public'

		if (!idRegister || !idUser || !idPatient) //|| !privateKey
			return res.send({ "success": false, "message": 'Some field is empty!' });


		console.log(
			"idRegister: " +  idRegister,
			"idPatient: " +  idPatient,
			"idUser: " +  idUser,
		);
		//Check if there is a given record
		let checkRecordPatient = await connect.connectContractRead().checkRecordOwner(idRegister, idPatient);
		let checkRecordEntity = await connect.connectContractRead().checkAccess(idRegister, idUser);

		try {
			console.log(checkRecordEntity)
			if(!checkRecordEntity)
				return res.send({ "success": false, "message": 'This entity does not have access to the record ' +  idRegister});

			
			if (!checkRecordPatient) {
				return res.send({ "success": false, "message": 'This record don\'t belong to this patient!' });
			} else {
				var options = {
					gasLimit: 9999999,
					gasPrice: ethers.utils.parseUnits('220', 'gwei')
				}

				connect.connectContractWrite(privateKey).denyAccess(idRegister, idUser, options).then((access) =>{
					console.log(access);
					connect.provider.waitForTransaction(access.hash).then((receipt) => {
						if(receipt.status == 0){
							res.send({ "success": false, "message": 'Error registering access!'})
						}else{
							res.send({ "success": true, "message": 'Access successfully registered!'})
		 }					
		 console.log(receipt);
					});
				});
				
			}
		} catch (err) {
			res.send({ "success": false, "message": 'Error registering record! ERROR: ' + err.message + "." })
		}
	}),

	
	/**
	 * Read Record Request
	 * In this request, it will return a specific record.
	 */

	 //melhorar definição das variáveis que representa o id da entidade e do paciente para controle de acesso

	app.post('/read_record_bc/', async (req, res) => {
		const idRegister = req.body.idRegister
		const idUser = req.body.idUser

		try {
			//let documentsList = await connect.connectContractRead().getAllDocumentBlockchain();
			let response = await connect.connectContractRead().readRecord(idRegister, idUser);

			res.setHeader('Content-Type', 'application/json');

			//Check if there is a given record that belongs to a patient or if someone entity has access
			let checkRecordPatient = await connect.connectContractRead().checkRecordOwner(idRegister.toFixed(), idUser.toFixed());
			console.log(checkRecordPatient)
			let checkRecordEntity = await connect.connectContractRead().checkAccess(idRegister.toFixed(), idUser.toFixed());
			console.log(checkRecordEntity)

			if (!checkRecordPatient){
				res.send({ "success": false, "message": "Patient " + idUser + " does not owner of this record!" });
			} else {
				console.log(response);
				// Smart contract returns a vector response["id"].
				let record = {
					"arquivoHash": response
					//"timestamp": parseInt(response[2]._hex, 16)
				}
				res.send(JSON.stringify({ "success": true, "message": "Record successfully returned!", "record": record }));
			}
		} catch (e) {
			res.send({ "success": false, "message": 'Error registering document! ERROR: ' + e.message + "." })
		}
	}),

	
	
	

	app.post('/list_records/', async (req, res) => {

		const client = new Client({
			cloud: { secureConnectBundle: 'api/secure-connect-pepchain.zip' },
			credentials: { username: 'pamella.soaresds@gmail.com', password: 'ommited for public' },
			keyspace: 'pepchain'
		});

		await client.connect();

		const registers = await client.execute(`SELECT * FROM pepchain`);

		await client.shutdown();

		if(!registers.rows.length)
			return res.send({"success": false, "message": "Record "+idRegister+" not registered", "result": registers.rows});
		else
			return res.send({"success": true, "register": registers.rows});
	}),


	 

	app.post('/read_all_records_bdd/', async (req, res) => {

		const client = new Client({
			cloud: { secureConnectBundle: 'api/secure-connect-pepchain.zip' },
			credentials: { username: 'pamella.soaresds@gmail.com', password: 'ommited for public' },
			keyspace: 'pepchain'
		});

		const idPatient = req.body.idPatient
		if (!idPatient)
			return res.send({ "success": false, "message": 'Some field is empty!'});
		
		await client.connect();

		const registers_patient = await client.execute(`SELECT * FROM pepchain WHERE patient_id = '${idPatient}' ALLOW FILTERING`);

		await client.shutdown();

		//if(!registers_patient.rows.length)
		//return res.send({"success": false, "message": "Patient "+idPatient+" has no registered records", "result": registers_patient.rows});
		//else
		return res.send({"success": true, "register": registers_patient});
	}),

	app.post('/delete_record_bdd/', async (req, res) => {

		const client = new Client({
			cloud: { secureConnectBundle: 'api/secure-connect-pepchain.zip' },
			credentials: { username: 'pamella.soaresds@gmail.com', password: 'ommited for public' },
			keyspace: 'pepchain'
		});

		const idRegister = req.body.idRegister
		const idPatient = req.body.idPatient

		if (!idRegister || !idPatient)
			return res.send({ "success": false, "message": 'Some field is empty!'});
		
		await client.connect();

		const register_search = await client.execute(`SELECT * FROM pepchain WHERE 
													register_id = '${idRegister}' 
													and patient_id = '${idPatient}' ALLOW FILTERING`);
		
		if(!register_search.rows.length){
			return res.send({"success": false, "message": "Record "+idRegister+" not registered for Patient " 
							+idPatient, "result": register_search.rows});
		} else {
			const register = await client.execute(`DELETE FROM pepchain 
												   WHERE register_id = '${idRegister}'`);
			await client.shutdown();

			return res.send({"success": true, "register": register});
		}
	})


}

