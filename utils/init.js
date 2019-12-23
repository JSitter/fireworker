module.exports = () => {
    const express = require('express');
    const crypto = require('crypto');
    const process = require('process');
    const path = require('path');

    const initializeSecretKey = function () {
        return crypto.randomBytes(2048).toString('hex');
    }

    if(!process.env.SECRETKEY){

        process.env.SECRETKEY = initializeSecretKey();
        console.log("Initialized Secret Key")
    }

    const app = express();

    return app;
}
