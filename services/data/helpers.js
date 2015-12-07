import _ from 'lodash';
import Promise from 'bluebird';

const mandatory = () => {
    throw new Error('Missing parameter');
}

const findLastMatch = (result) => {
	if (result.results_remaining > 0) {
	    var lastMatch = result.matches[(_.findLastKey(result.matches, 'match_id'))];
	    return lastMatch.match_id;
	} else {
		return false;
	}
};

const combineResults = (newResult, oldResult) => {
	let obj1 = oldResult.matches,
		obj2 = oldResult.matches,
		oldResultLength = Object.keys(oldResult.matches).length;

	_.forEach(newResult.matches, function(value, key){
	    oldResult.matches[key + oldResultLength] = value;
	});

	newResult.matches = oldResult.matches;
	return newResult;
};

const unPackDynamo = (data) => {
  var arr = [];
  _.forEach(data.Items, function(value, key){
      _.forEach(value, function(innerValue, innerKey){
        var innerKeyKey = Object.keys(innerValue)[0];
        if (innerKeyKey === 'N' || innerKeyKey === 'S'){
          data.Items[key][innerKey] = data.Items[key][innerKey][innerKeyKey];
        }
      });
      arr.push(data.Items[key]);
  })
  return arr;
};

const handleErr = (err, data) => {
	if (err) console.log(err, err.stack);
};

const defer = () => {
    let resolve, reject;
    let promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}

export {findLastMatch, combineResults, unPackDynamo, mandatory, defer}
