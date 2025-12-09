const functions = require('firebase-functions');
const app = require('../finance-backend/dist/main');

exports.api = functions.https.onRequest(app);
