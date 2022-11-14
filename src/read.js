"use strict";
const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
  try {
    const TableName = process.env.TRANSFERS_TABLE_NAME;
    const database = new AWS.DynamoDB.DocumentClient();
    const id = event.pathParameters?.id;
    const query = event.queryStringParameters?.query;
    const result = id
      ? await database.get({ TableName, Key: { id } }).promise()
      : query
      ? await database.query({ TableName, KeyConditionExpression: query }).promise()
      : await database.scan({ TableName }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
