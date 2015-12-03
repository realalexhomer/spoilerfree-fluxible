import db from './db';
import steam from './steam';

export default {
	initialize: function(){
		console.log('db init');
		steam.getTournament('3671').then( (res, err) => {console.log(res)} );
	},
	update: function(){

	}
}