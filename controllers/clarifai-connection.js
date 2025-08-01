const {
  CLARIFAI_PAT,
  CLARIFAI_USER_ID,
  CLARIFAI_APP_ID,
  CLARIFAI_MODEL_ID,
  CLARIFAI_MODEL_VERSION_ID,
} = require('../config');

const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + CLARIFAI_PAT);

const fetchClarifai = (req, res) => {
  return new Promise((resolve, reject) => {
    const imgUrl = req.body.input;
    stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: CLARIFAI_USER_ID,
          app_id: CLARIFAI_APP_ID,
        },
        model_id: CLARIFAI_MODEL_ID,
        version_id: CLARIFAI_MODEL_VERSION_ID,
        inputs: [{ data: { image: { url: imgUrl, allow_duplicate_url: true } } }],
      },
      metadata,
      (err, response) => {
        if (err) {
          reject(new Error(err.message || 'Clarifai API 連接錯誤'));
        } else if (response.status.code !== 10000) {
          reject(new Error(`Clarifai API 回應錯誤: ${response.status.description}`));
        } else {
          resolve(response);
        }
      }
    );
  });
};

// 原本的 fetchClarifai 函數，因為是用callback，error 無法被catch接住，改為上述的promise寫法。
const fetchClarifaiOriginal = (req, res) => {
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
