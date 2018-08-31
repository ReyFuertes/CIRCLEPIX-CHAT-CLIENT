import React, { Component } from 'react';
import ChatBoxMsgInfo from './chat-sms-info.component';
import OfflineFormComponent from './chat-form-offline.component';
import $ from 'jquery';
import configureStore from '../store/configure-store';
import { sendMessage } from '../actions/preferences-action';
import { deleteChannel } from '../actions/preferences-action';
import * as constants from '../shared/constants/appVar';
import WebUtility from '../shared/web-utility';
import Log from '../shared/logger';

const Chat = require('../../node_modules/twilio-chat/dist/twilio-chat');
const classNames = require('classnames');

class ChatWindowComponent extends Component {
  constructor(props) {
    super(props);

    const localStoragePrefs = JSON.parse(localStorage.getItem('prefs'));

    this.state = {
      activityTimerID: 0,
      chatMsgs: [],
      isInitialChat: true,
      isTimeout: false,
      hasLead: false,
      prefs: localStoragePrefs,
      friendlyName: `${localStoragePrefs.name}|${localStoragePrefs.identity}`,
      channel: null
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSendButtonClick = this.handleSendButtonClick.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);

    this.endChat = this.endChat.bind(this);
    this.sendAutoResponseMessage = this.sendAutoResponseMessage.bind(this);
  }

  componentDidMount() {
    if (!this.state.prefs.twilio_token) return;

    try {
      Chat.Client.create(this.state.prefs.twilio_token).then(chatClient => {
        return new Promise(() => {
          this.joinGeneralChannel(chatClient);
        });
      });

      $('#chatInput').prop('disabled', true);
      $('#btnSubmit').addClass('disabled-bg');
      $('#spinner-container').show();
    } catch (err) {
      Log.error('Catch Error connection ', 'componentDidMount');
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.activityTimerID);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onSendMessage();
    }

    if (e.key === undefined) {
      this.onSendMessage();
      this.handleMessage({ msg: this.refs.chatTxtInput.value, isAgent: false });
    }
  }

  onSendMessage() {
    const msgTxt = this.refs.chatTxtInput.value;
    if (msgTxt === '' || msgTxt === undefined) return;

    if (this.state.channel) {
      this.state.channel.sendMessage(msgTxt); 
    }
  }

  handleSendButtonClick(e) {
    if (this.state.channel) {
      this.state.channel.sendMessage(e.target.value); 
    }
  }

  joinGeneralChannel(chatClient) {
    chatClient.getSubscribedChannels().then(() => {
      chatClient.getChannelByUniqueName(this.state.prefs.session)
        .then(channel => {
          this.setState({ channel: channel });

          $('#spinner-container').hide();
          $('#chatInput').prop('disabled', false);
          $('#btnSubmit').removeClass('disabled-bg');
          $('#chatInput').focus();

          this.configureChannelEvents(channel);

          var msg =  this.props.prefs.is_online === false ? this.props.prefs.offline_message : this.props.prefs.default_message;
          if (this.props.prefs.is_online === true && this.props.prefs.phone_number !== '') {
            this.refs.chatTxtInput.focus();

            this.handleMessage({ msg: msg, isAgent: true});
          }

          if (channel.state.status !== 'joined') {
            channel.join().then(() => {
              window.addEventListener('beforeunload', () =>
                this.state.channel.leave()
              );
            })
            .catch(error =>
              Log.error('Could not join general channel: ' + error, 'channel.join')
            );
          }
        })
        .catch(() => {
          chatClient.createChannel({
            uniqueName: this.state.prefs.session,
            friendlyName: this.state.friendlyName
          })
          .then(() => {
            this.joinGeneralChannel(chatClient);
          })
          .catch(error =>
            Log.error('Could not create general channel: ' + error, 'createChannel')
          );
        });
    })
    .catch(error => {
      Log.error('Could not get channel list: ' + error, 'getSubscribedChannels');
    });
  }

  createGeneralChannel(chatClient) {
    return new Promise(reject => {
      chatClient.createChannel({
          uniqueName: this.state.prefs.session,
          friendlyName: this.state.friendlyName
        })
        .then(() => this.joinGeneralChannel(chatClient))
        .catch(() => reject(Error('Could not create general channel.')));
    });
  }

  configureChannelEvents(channel) {
    channel.on('messageAdded', msg => {
      if (msg.author === this.state.prefs.identity) {
        this.handleMessage({ msg: msg.body, isAgent: false });
      } else {
        this.handleMessage({ msg: msg.body, isAgent: true });
      }
    });
  }

  handleMessage(msgInfo) {
    var newArray = this.state.chatMsgs.slice();
    newArray.push(msgInfo);
    this.setState({ chatMsgs: newArray });

    //send message to agent if valid and not from agent
    if ((msgInfo != null) && (msgInfo.msg) && (!msgInfo.isAgent)) {
      //this.refs.chatTxtInput.value = '';//clear chat-space only if msg is from user
      $('#chatInput').val(''); // use jquery to clear value

      var messageBody = {
        'to': this.props.prefs.phone_number,
        'from': this.props.prefs.twilio_number,
        'message': msgInfo.msg
      }
      
      if (this.state.isInitialChat) {
        //add tourId to message body before sending
        messageBody['tourId'] = +WebUtility.getTourInfo().tourId;
        this.setState({ isInitialChat: false });
      }

      const store = configureStore();
      store.dispatch(sendMessage(messageBody));
    }
    //monitor if agent is idle to know if auto response is needed
    this.checkChatActivity(msgInfo.isAgent, msgInfo.msg);
  }

  checkChatActivity(isAgent, message) {
    let timerID = this.resetTimer(this.state.activityTimerID);

    var action = null;
    if (isAgent) {
      action = this.endChat;
    } else {
      if (this.props.prefs.auto_response_delay <= constants.chatTimeoutValue) {
        //auto-response is triggered first
        action = this.sendAutoResponseMessage;
      } else {
        action = this.endChat;
      } 
    }

    let delay = this.calculateTimeoutDelay(isAgent, message);
    let newTimerID = this.startTimer(timerID, delay, action);
    this.setState(() => ({ activityTimerID: newTimerID }));
  }

  calculateTimeoutDelay(isAgent, message) {
    var delay = 0;

    let sessionExpireTimerValue = constants.chatTimeoutValue;
    let autoResponseTimerValue = this.props.prefs.auto_response_delay;
    if (isAgent) {
      if (message !== this.props.prefs.auto_response_message) {
        //message is not an auto-response, reset session timer
        delay = sessionExpireTimerValue * 1000;
      } else {
        //message is auto response, calculate remaining time before session ends
        if (autoResponseTimerValue <= sessionExpireTimerValue) {
          delay = (sessionExpireTimerValue - autoResponseTimerValue) * 1000;
        } else {
          delay = sessionExpireTimerValue * 1000;
        }
      }
    } else {
      if (autoResponseTimerValue <= sessionExpireTimerValue) {
        //auto-response is triggered first
        delay = autoResponseTimerValue * 1000;
      } else {
        delay = sessionExpireTimerValue * 1000;
      }
    }
    return delay;
  }

  startTimer(timerID, delay, doAction) {
    var newTimerID = 0;
    if (timerID === 0) {
      newTimerID = setTimeout(() => {
        if (doAction != null) doAction();
      }, delay);
    }

    return newTimerID;
  }

  resetTimer(timerID) {
    if (timerID !== 0) {
      clearTimeout(timerID);
      timerID = 0;
    }
    return timerID;
  }

  endChat() {
    this.setState( {isTimeout: true });
    const store = configureStore();
    store.dispatch(deleteChannel(this.props.prefs.session));
  }

  sendAutoResponseMessage() {
    let message = this.props.prefs.auto_response_message;
    this.handleMessage({ msg: message, isAgent: true});
  }

  render() {
    var iconClasses = classNames({
      'col-xs-2': true,
      'disabled-bg': this.state.isTimeout ? 'disabled-bg' : '',
      'cpx_icon-enabled': !this.state.isTimeout ? 'cpx_icon-enabled' : ''
    });

    var chatClassHeight = classNames({
      'msg-container custom-scrollbar': true,
      'cpx-offline-min-height': !this.props.prefs.is_online,
      'min-msg-container': this.props.isLeadFormVisible,
    })
    return (
      <div className='cpx_chat-window'>
        <div className="row no-margin">
          {this.props.prefs.phone_number === '' ||
          this.props.prefs.is_online === false ? (
            <OfflineFormComponent prefs={this.props.prefs} />
          ) : (
            <div className={chatClassHeight}>
              <div id="spinner-container">
                <i className="fas fa-spinner fa-pulse fa-3x" />
              </div>
              {this.state.chatMsgs.length > 0
                ? this.state.chatMsgs.map((item, index) => (
                    <ChatBoxMsgInfo
                      compId={index}
                      key={index}
                      isAgent={item.isAgent}
                      msgInfo={item.msg}
                      agentName={this.props.prefs.name}
                    />
                  ))
                : ''}
            </div>
          )}
        </div>
        {this.state.isTimeout === true ? (
          <div className="timeout-container">Session Timeout..</div>
        ) : (
          ''
        )}
        {this.props.prefs.is_online === true &&
        this.props.prefs.phone_number !== '' ? (
          <div className="chat-window-actions col-xs-12">
            <div className="col-xs-10">
              <input
                id="chatInput"
                disabled={this.state.isTimeout}
                type="text"
                ref="chatTxtInput"
                onKeyPress={this.handleKeyPress}
                onClick={toggle => this.props.onChatClick()}
                className="form-control"
              />
            </div>
            <div id="btnSubmit" onClick={this.onSendMessage} className={iconClasses}>
              <i className="fas fa-paper-plane fa-2x btn-icon-send" />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ChatWindowComponent;
