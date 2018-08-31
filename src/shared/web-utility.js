class WebUtility {

  static getEnvSetup() {
    let subDomain = this.getSubDomain();
    let env = '';

    switch(subDomain) {
      case 'reil':
      case 'rey':
      case 'jyu':
      case 'localhost':
        env = 'local-dev';
        break;

      case 'teampixmarketing':
      case 'wendell':
      case 'pm':
        env = 'stage';
        break;

      default:
        env = 'live';
        break;
    }

    return env;
  }

  static getHost() {
    return window.location.host;
  }

  static getSubDomain() {
    return window.location.hostname.split('.')[0];
  }

  static getTourInfo() {
    return window.tourInfo;
  }

  static getAgentID() {
    const agentID = document.querySelector('.cpx_chat-container').getAttribute('agentId');
    return agentID;
  }
  
}
  
export default WebUtility;
  