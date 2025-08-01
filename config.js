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
  // default config
  HEROKU_SERVER_TO_HEROKU_DB: {
    client: 'pg', // postgres
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  LOCAL_SERVER_TO_LOCAL_DB: {
    client: 'pg', // postgres
    connection: {
      host: '127.0.0.1', // localhost
      user: '',
      password: '',
      database: 'smartcomputer',
    },
  },
};

const getKnexConfig = (env) => {
  switch (env) {
    case 'LOCAL_SERVER_TO_HEROKU_DB':
      return DB_CONFIG.LOCAL_SERVER_TO_HEROKU_DB;
    case 'LOCAL_SERVER_TO_LOCAL_DB':
      return DB_CONFIG.LOCAL_SERVER_TO_LOCAL_DB;
    default:
      return DB_CONFIG.HEROKU_SERVER_TO_HEROKU_DB;
  }
};

const knexConfiguration = getKnexConfig(process.env.KNEX_CONFIG);

module.exports = {
  endpoint: process.env.CLARIFAI_API_URL,
  apiKey: process.env.CLARIFAI_API_KEY,
  port: process.env.PORT,
  database: process.env.DATABASE_URL,

  CLARIFAI_PAT: process.env.CLARIFAI_PAT,
  CLARIFAI_USER_ID: process.env.CLARIFAI_USER_ID,
  CLARIFAI_APP_ID: process.env.CLARIFAI_APP_ID,
  CLARIFAI_MODEL_ID: process.env.CLARIFAI_MODEL_ID,
  CLARIFAI_MODEL_VERSION_ID: process.env.CLARIFAI_MODEL_VERSION_ID,

  KNEX_CONFIGURATION: knexConfiguration,
};
