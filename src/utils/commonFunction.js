const axios = require('axios');

const { Request } = require('../models');

const ApiError = require('./ApiError');
const httpStatus = require('http-status');
const ObjectId = require('mongoose').Types.ObjectId;
const admin = require('firebase-admin');

const getClientId = async (req) => {

    clientId = '';

    if (!req.headers.clientid) {

        throw new ApiError(httpStatus.NOT_FOUND, 'ClientID not found');

    } else {

        clientId = req.headers.clientid;

    }

    return clientId;
}











async function generateRequestNumber() {
    // Fetch the latest record from the Requests table
    const latestRequest = await Request.findOne({
        order: [['createdAt', 'DESC']], // Assuming `createdAt` is your timestamp column
    });

    let lastIndex = 0;

    if (latestRequest && latestRequest.requestNumber) {
        // Extract the number part after the underscore
        const requestNumberParts = latestRequest.requestNumber.split('_');
        lastIndex = parseInt(requestNumberParts[1], 10) || 0;
    }

    // Increment the index
    const index = lastIndex + 1;

    // Format the new request number
    return `KO_${String(index).padStart(5, '0')}`;
}



// Calculate distance using Google Distance Matrix API

const uniqueRandomNumbers = async (qnty) => {

    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return randomNumber;

};


const sendError = (message, data, code) => ({
    success: false,
    message,
    data,
    code,
});



module.exports = { generateRequestNumber, uniqueRandomNumbers };
