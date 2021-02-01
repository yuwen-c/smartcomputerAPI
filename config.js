const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    ENDPOINT: process.env.CLARIFAI_API_URL,
    APIKEY: process.env.CLARIFAI_API_KEY,
    PORT: process.env.PORT
};