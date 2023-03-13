const { fetchClarifai } = require('./clarifai-connection');

// get url from request of frontend, do fetch to clarifar server,
// get face region data, send it through response to front end.
const handleApiCall = (req, res) => {
  fetchClarifai(req, res);
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id: id })
    .returning('entries')
    .increment('entries', 1)
    .then((data) => res.json(data));
};

module.exports = {
  handleImage,
  handleApiCall,
};
