import _ from 'lodash';

export default {
	findLastMatch: (result) => {
		if (result.results_remaining > 0) {
		    var lastMatch = result.matches[(_.findLastKey(result.matches, 'match_id'))];
		    return lastMatch.match_id;
		} else {
			return false;
		}
	},
	combineResults: (newResult, oldResult) => {
		let obj1 = oldResult.matches,
			obj2 = oldResult.matches,
			oldResultLength = Object.keys(oldResult.matches).length;

		_.forEach(newResult.matches, function(value, key){
		    oldResult.matches[key + oldResultLength] = value;
		});

		newResult.matches = oldResult.matches;

		return newResult;
	}
}