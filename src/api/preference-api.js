import * as constants from '../shared/constants/appVar';
import offlinePref from './data/pref-data';

class PreferencesApi {
  static handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  static getPreferences(identity) {
    let userIdentity = SessionBuilder.generateUserIdentity();
    let baseURL = URLBuilder.getBaseURL();

    const URL = `${baseURL}/chat/preferences/${
        identity.agentId
      }/${userIdentity}`;

    return fetch(URL, { method: 'GET' })
      .then(this.handleErrors)
      .then(response => Promise.all([response, response.json()]))
      .catch(error => {
        return new Promise(resolve => {
          resolve(Object.assign([], offlinePref));
        });
      });
  }

  static sendMessage(payload) {
    if (WebUtility.getEnvSetup() === 'local-dev') {
      Log.info(payload, 'API sending twilio message: ');
      return new Promise(function (resolve, reject) { resolve(true); });
    }

    let baseURL = URLBuilder.getBaseURL();

    var request = new Request(`${baseURL}/chat/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return fetch(request)
      .then(response => Promise.all([response, response.json()]))
      .catch(error => {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  static generateLead(leads) {
    let baseURL = URLBuilder.getBaseURL();
    var request = new Request(`${baseURL}/leads`, {
      method: 'POST',
      body: JSON.stringify(leads)
    });

    return fetch(request)
      .then(response => Promise.all([response, response.json()]))
      .catch(error => {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  static deleteChannel(channelName) {
    let baseURL = URLBuilder.getBaseURL();
    var request = new Request(`${baseURL}/chat/sessions/${channelName}`, {
      method: 'POST',
    });

    return fetch(request)
      .then(response => Promise.all([response, response.json()]))
      .catch(error => {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }
}

export default PreferencesApi;
