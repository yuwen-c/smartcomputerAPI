const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    endpoint: process.env.CLARIFAI_API_URL,
    masterKey: process.env.CLARIFAI_API_KEY,
    port: process.env.PORT
};