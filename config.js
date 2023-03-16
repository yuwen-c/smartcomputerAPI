DB_CONFIG = {
  LOCAL_SERVER_TO_HEROKU_DB: {
    client: 'pg',
    connection: {
      host: process.env.KNEX_HOST,
      user: process.env.KNEX_USER,
      password: process.env.KNEX_PASSWORD,
      database: process.env.KNEX_DATABASE,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
console.log('knex env', process.env.KNEX_CONFIG);
let configuration;
if (process.env.KNEX_CONFIG === 'LOCAL_SERVER_TO_HEROKU_DB') {
  configuration = DB_CONFIG.LOCAL_SERVER_TO_HEROKU_DB;
}

module.exports = {
  endpoint: process.env.CLARIFAI_API_URL,
  apiKey: process.env.CLARIFAI_API_KEY,
  port: process.env.PORT,
  database: process.env.DATABASE_URL,

  CLARIFAI_PAT: process.env.CLARIFAI_PAT,
  CLARIFAI_USER_ID: process.env.CLARIFAI_USER_ID,
  CLARIFAI_APP_ID: process.env.CLARIFAI_APP_ID,
  CLARIFAI_MODEL_ID: process.env.CLARIFAI_MODEL_ID,

  CONFIGURATION: configuration,
};
