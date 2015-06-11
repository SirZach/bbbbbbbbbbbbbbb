/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'webatrice',
    environment: environment,
    contentSecurityPolicy: { 'connect-src': "'self' wss://*.firebaseio.com" },
    firebase: 'https://dazzling-fire-7827.firebaseio.com/',
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicy = {
      'img-src': "'self' http://localhost:3000 https://avatars.githubusercontent.com https://www.gravatar.com http://avatars.io http://pbs.twimg.com",
      'font-src': "https://fonts.gstatic.com http://localhost:4200 http://www.fontsaddict.com",
      'style-src': "'self' 'unsafe-inline'",
      'connect-src': "'self' http://localhost:3000 https://s-dal5-nss-18.firebaseio.com wss://s-dal5-nss-18.firebaseio.com https://api.app.netuitive.com",
      'report-uri': "'none'",
      'script-src': "'self' 'unsafe-eval' localhost:35729 0.0.0.0:35729 https://assets.app.netuitive.com"
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
