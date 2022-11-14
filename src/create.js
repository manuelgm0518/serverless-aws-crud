"use strict";
const { v4: uuid } = require("uuid");
const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
  try {
    const TableName = process.env.TRANSFERS_TABLE_NAME;
    const database = new AWS.DynamoDB.DocumentClient();
    const {
      monto,
      tipo,
      originName,
      originRut,
      originAccount,
      receiverRut,
      originBankCode,
      originBankName,
      comment,
      originAccountType,
    } = JSON.parse(event.body);
    const now = new Date();
    const newTransfer = {
      id: uuid(),
      fecha: now.toTimeString(),
      fechaMovimiento: now.getTime(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      validatedAt: null,
      validated: false,
      inUse: false,
      monto,
      tipo,
      originName,
      originRut,
      originAccount,
      receiverRut,
      originBankCode,
      originBankName,
      comment,
      originAccountType,
    };
    await database.put({ TableName, Item: newTransfer }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(newTransfer),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
