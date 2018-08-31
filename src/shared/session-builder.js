import WebUtility from './web-utility';
import Log from './logger';

class SessionBuilder {
  
  static getSessionStorageKey() {
    return 'chat-info';
  }

  static getRandomIdentity() {
    const maxCount = 99;
    const identityPrefix = 'guest';

    return `${identityPrefix}${Math.floor(Math.random() * Math.floor(maxCount))}`;
  }

  static generateUserIdentity() {
    const agentID = WebUtility.getAgentID();
    const storageKey = this.getSessionStorageKey();
    var sessions = JSON.parse(localStorage.getItem(storageKey)) || {};

    if (sessions[agentID] == null) {
      sessions[agentID] = this.getRandomIdentity();
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    }

    Log.info(sessions[agentID], 'generateUserIdentity');
    return sessions[agentID];
    //return 'tester';
  }

  static deleteUserIdentity() {
    const agentID = WebUtility.getAgentID();
    const storageKey = this.getSessionStorageKey();
    var sessions = JSON.parse(localStorage.getItem(storageKey)) || {};

    delete sessions[agentID];
    localStorage.setItem(storageKey, JSON.stringify(sessions));
  }
  
}
  
export default SessionBuilder;
  