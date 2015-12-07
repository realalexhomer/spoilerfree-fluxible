import AWS from 'aws-sdk';
import Promise from 'bluebird';
import _ from 'lodash';
import {allTableParams} from '../../utils/constants';

const db = new AWS.DynamoDB({
  // endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  endpoint: "http://localhost:8000", 
  region: 'us-east-1'
});

db.scan = Promise.promisify(db.scan);
db.batchWriteItem = Promise.promisify(db.batchWriteItem);
db.createTable = Promise.promisify(db.createTable);
db.describeTable = Promise.promisify(db.describeTable);

export {db}