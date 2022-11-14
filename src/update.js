"use strict";
const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
  try {
    const TableName = process.env.TRANSFERS_TABLE_NAME;
    const database = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;
    const { validated, comment, inUse } = JSON.parse(event.body);
    const now = new Date();
    const result = await database
      .update({
        TableName,
        Key: { id },
        ReturnValues: "ALL_NEW",
        UpdateExpression:
          "set validated=:validated, validatedAt=:validatedAt, updatedAt=:updatedAt, comment=:comment, inUse=:inUse",
        ExpressionAttributeValues: {
          validated,
          comment,
          inUse,
          updatedAt: now.toISOString(),
          validatedAt: validated ? now.toISOString() : null,
        },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
