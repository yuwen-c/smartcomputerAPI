module.exports = {
  endpoint: process.env.CLARIFAI_API_URL,
  apiKey: process.env.CLARIFAI_API_KEY,
  port: process.env.PORT,
  database: process.env.DATABASE_URL,

  KNEX_HOST: process.env.KNEX_HOST,
  KNEX_USER: process.env.KNEX_USER,
  KNEX_PASSWORD: process.env.KNEX_PASSWORD,
  KNEX_DATABASE: process.env.KNEX_DATABASE,
  CLARIFAI_PAT: process.env.CLARIFAI_PAT,
  CLARIFAI_USER_ID: process.env.CLARIFAI_USER_ID,
  CLARIFAI_APP_ID: process.env.CLARIFAI_APP_ID,
  CLARIFAI_MODEL_ID: process.env.CLARIFAI_MODEL_ID,
};
