import db from './db';
import steam from './steam';
import {unPackDynamo, defer} from './helpers'

export default {
	initialize: function(tableName){
		let tournamentData;
		return new Promise((resolve, reject) => {
			steam.getTournament(tableName)
			.then( (res) => {
				tournamentData = res;
				return db.describeTable(tableName)
			})
			.catch((err) => {
				if (err.code === 'ResourceNotFoundException') {
					db.createTournament(tableName)
					.catch( (err) => {
						throw err;
					})
					.then( (res) => {
						resolve(db.waitForTable(tableName));
					});
				} else {
					reject(err);
				}
			})
			.then( (res) => {
				resolve(db.writeMatches({result: tournamentData, tableName: tableName}));
			})
			.catch( (err) => { reject(err) });
		})
	},
	getAll: function(tableName){
		return new Promise((resolve, reject) => {
			db.getMatches(tableName)
			.then( (res) => {
				resolve(unPackDynamo(res));
			})
			.catch( (err) => { reject(err) });
		}) 
	},
	update: function(){

	}
}

// TODO: store lastmatchID
