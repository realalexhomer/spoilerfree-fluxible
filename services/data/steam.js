import {steamUrl, steamKey} from '../../utils/constants';
import {findLastMatch, combineResults} from './helpers';
import Promise from 'bluebird';
import request from 'request-promise';
import _ from 'lodash';

export default {
	getTournament: (tournamentId, lastMatchId) => {
		const resolver = Promise.defer();

		const get = (prevResult, lastMatchId) => {
			let reqUrl = steamUrl + '/GetMatchHistory/V001/?league_id=' +
				  tournamentId + '&key=' + steamKey;

			if (lastMatchId !== undefined){
				reqUrl = reqUrl + '&start_at_match_id=' + lastMatchId.toString();
			}

			request(reqUrl)
			.then(function(res, err) {
				let result = JSON.parse(res).result;
				let lastMatchToQuery = findLastMatch(result);

				if (prevResult){
					result = combineResults(result, prevResult);
				}

				if (!lastMatchToQuery) {
					resolver.resolve(result);
				} else {
					get(result, lastMatchToQuery);
				}
			});
		}

		get();
		return resolver.promise;
	}
}