import * as types from '../actions/action-types';

export default function preferencesReducer(state = [], action) {
  switch (action.type) {
    case types.GET_PREFERENCES_SUCCESS:
      return action.preferences;

    case types.POST_SEND_MESSAGE_SUCCESS:
      return action.payload.msgText;

    case types.POST_GENERATE_LEAD_SUCCESS:
      return action.leads.leadInfo;

    case types.POST_DELETE_CHANNEL_SUCCESS:
      return action.channel.channelName;

    default:
      return state;
  }
}
