const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({apiKey: process.env.CLARIFAI_API_KEY});

// get url from request of frontend, do fetch to clarifar server,
// get face region data, send it through response to front end.
const handleApiCall = (req, res) => {
    //face_detect_Model from Clarifai
    clarifaiApp.models.predict(process.env.CLARIFAI_API_URL, req.body.input)
    .then(response => res.json(response))
    .catch(err => res.status(400).json(err))
}


const handleImage = (db)=> (req, res) => {
    const { id } = req.body;
    db('users')
    .where({id: id})
    .returning('entries')
    .increment('entries', 1)
    .then(data => res.json(data));
}

module.exports = {
    handleImage, handleApiCall
};