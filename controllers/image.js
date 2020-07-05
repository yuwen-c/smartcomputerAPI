const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({apiKey: '39549cfbc39a4a6d8c78bd943cd62036'});

const handleApiCall = (req, res) => {
    //face_detect_Model from Clarifai
    clarifaiApp.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
    .then(response => res.json(response))
    .catch(err => res.status(400).json("unable to reach Clarifai server"))
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