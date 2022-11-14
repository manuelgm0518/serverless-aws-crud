"use strict";
const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
  try {
    const TableName = process.env.TRANSFERS_TABLE_NAME;
    const database = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;
    await database.delete({ TableName, Key: { id } }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Transfer deleted successfully",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
