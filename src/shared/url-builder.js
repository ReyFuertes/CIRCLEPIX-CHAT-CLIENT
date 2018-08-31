import WebUtility from './web-utility';

class URLBuilder {

  static getSourceURL() {
    let env = WebUtility.getEnvSetup();
    let url = '';

    switch(env) {
      case 'local-dev':
        url = 'pm.circlepix.com';
        break;

      default:
        url = WebUtility.getHost();
        break;
    }

    return "http://" + url;
  }

  static getBaseURL() {
    let env = WebUtility.getEnvSetup();
    let url = '';

    switch(env) {
      case 'local-dev':
        url = 'pm-go.circlepix.com:3000';
        break;

      case 'stage':
        url = 'dev-api01.circlepix.com';
        break;

      default:
        url = 'api.circlepix.com';
        break;
    }

    return "http://" + url;
  }
}

export default URLBuilder;
