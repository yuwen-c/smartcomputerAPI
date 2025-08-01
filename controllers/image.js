const { fetchClarifai } = require('./clarifai-connection');

// get url from request of frontend, do fetch to clarifar server,
// get face region data, send it through response to front end.
const handleApiCall = async (req, res) => {
  try {
    const result = await fetchClarifai(req, res);
    res.json(result);
  } catch (error) {
    console.error('Clarifai API Error:', error.message);
    
    // 根據錯誤類型回傳不同的狀態碼
    if (error.message.includes('Clarifai API 連接錯誤')) {
      res.status(500).json({
        error: 'Clarifai API 連接錯誤',
        details: error.message
      });
    } else if (error.message.includes('Clarifai API 回應錯誤')) {
      res.status(400).json({
        error: 'Clarifai API 回應錯誤',
        details: error.message
      });
    } else {
      res.status(500).json({
        error: '伺服器內部錯誤',
        details: error.message
      });
    }
  }
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
