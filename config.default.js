var config = {
  twitter: {
    consumer_key: 'xxxxx',
    consumer_secret: 'xxxxxx',
    access_token_key: 'xxxxx',
    access_token_secret: 'xxxxx',
  },
  mongodb: {
    databaseUrl: "mongodb://localhost/" + port,
    port: 27017,
    username: "",
    password: ""
  },
  port: process.env.PORT || 4000,
  ip: "127.0.0.1",
  logLevel: process.env.LOG_LEVEL || "debug",
};

module.exports = config;
