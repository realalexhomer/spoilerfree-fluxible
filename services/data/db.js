import {db as dynamoDb} from './dynamoDb';
import AWS from 'aws-sdk';
import _ from 'lodash';
import {allTableParams} from '../../utils/constants';
import {mandatory} from './helpers';
import Promise from 'bluebird';

export default {

    describeTable(tableName='3671') {
        return dynamoDb.describeTable({TableName: tableName});
    },

    getMatches(tableName='3671', ProjectionExpression= allTableParams) {
        let params = {};
        params.TableName = tableName;
        params.ProjectionExpression = ProjectionExpression;

        return dynamoDb.scan(params);
    },

    writeMatches({result = mandatory(), tableName='3671'}) {
        const self = this;
        const matchArr = [];

        _.forEachRight(result.matches, function(match){
            if (!match.series_id) match.series_id = 0;
            if (!match.series_type) match.series_type = 0;
            let newMatch = {
                id: {S : match.match_id.toString()},
                seriesId: {N : match.series_id.toString()},
                seqNumber: {N : match.match_seq_num.toString()},
                startTime: {N : match.start_time.toString()},
                team1Id: {N : match.radiant_team_id.toString()},
                team2Id: {N : match.dire_team_id.toString()},
                seriesType: {N : match.series_type.toString()},
            };
            matchArr.push(newMatch);
        });

        const uniqMatchArr = _.uniq(matchArr, function(match){
            return match.id.S;
        });

        if (uniqMatchArr.length > 20) {
            _.forEach(_.chunk(uniqMatchArr, 20), function(arr){ // todo:
                                                                // promisify
                self.sendBatch(arr, tableName);
            });
        } else {
          self.sendBatch(uniqMatchArr, tableName);
        }
    },

    sendBatch(arr = mandatory(), tableName = mandatory()){
        const params = {};
        params.RequestItems = {};
        params.RequestItems[tableName] = arr.map(function(item) { return {PutRequest: {Item: item}} });
        dynamoDb.batchWriteItem(params)
        .then(function(res, err){
            if (err){
                throw err;
            } else {
                console.log('success in write batch', res);
            }
        });
    },

    createTournament(tableName = mandatory()) {
        console.log('create table being called');
        return dynamoDb.createTable({
            TableName: tableName,
            KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
            AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
            ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
        });
    },

    waitForTable(tableName = mandatory()) {
        var waiter = new AWS.ResourceWaiter(dynamoDb, 'tableExists')
        waiter.wait = Promise.promisify(waiter.wait);
        waiter.config.interval = 1;
        return waiter.wait({TableName: tableName});
    }

}
