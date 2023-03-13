const {
  CLARIFAI_PAT,
  CLARIFAI_USER_ID,
  CLARIFAI_APP_ID,
  CLARIFAI_MODEL_ID,
} = require('../config');

const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + CLARIFAI_PAT);

const fetchClarifai = (req, res) => {
  const imgUrl = req.body.input;
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: CLARIFAI_USER_ID,
        app_id: CLARIFAI_APP_ID,
      },
      model_id: CLARIFAI_MODEL_ID,
      inputs: [{ data: { image: { url: imgUrl, allow_duplicate_url: true } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          'Post model outputs failed, status: ' + response.status.description
        );
      }
      res.json(response);
    }
  );
};

module.exports = {
  fetchClarifai,
};
