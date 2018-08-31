import PreferencesApi from '../api/preference-api';

export const GET_PREFERENCES_SUCCESS = 'GET_PREFERENCES_SUCCESS';
export const POST_SEND_MESSAGE_SUCCESS = 'POST_SEND_MESSAGE_SUCCESS';
export const POST_GENERATE_LEAD_SUCCESS = 'POST_GENERATE_LEAD_SUCCESS';
export const POST_DELETE_CHANNEL_SUCCESS = 'POST_DELETE_CHANNEL_SUCCESS';

// get preferences
export function loadPreferenceSuccess(preferences) {
  return { type: GET_PREFERENCES_SUCCESS, preferences };
}
export function loadPreferences(param) {
  return function(dispatch) {
    return PreferencesApi.getPreferences(param)
      .then(preferences => {
        dispatch(loadPreferenceSuccess(preferences));
      })
      .catch(error => {
        throw error;
      });
  };
}

// send message
export function sendMessageSuccess(msgText) {
  return { type: POST_SEND_MESSAGE_SUCCESS, payload: { msgText } };
}
export function sendMessage(msgText) {
  return function(dispatch) {
    return PreferencesApi.sendMessage(msgText)
      .then(response => {
        dispatch(sendMessageSuccess(response));
      })
      .catch(error => {
        throw error;
      });
  };
}

//generate leads
export function generateLeadSuccess(leadInfo) {
  return { type: POST_GENERATE_LEAD_SUCCESS, leads: { leadInfo } };
}
export function generateLead(leadInfo) {
  return function(dispatch) {
    return PreferencesApi.generateLead(leadInfo)
      .then(response => {
        dispatch(generateLeadSuccess(response));
      })
      .catch(error => {
        throw error;
      });
  };
}

//delete channel
export function deleteChannelSuccess(channelName) {
  return ({ type: POST_DELETE_CHANNEL_SUCCESS, channel: { channelName }});
}
export function deleteChannel(channelName) {
  return function(dispatch) {
    return PreferencesApi.deleteChannel(channelName)
      .then(response => {
        dispatch(deleteChannelSuccess(response));
      })
      .catch(error => {
        throw error;
      });
  };
}
