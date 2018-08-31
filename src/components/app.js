import React, { Component } from 'react';
import BaseModalPage from '../containers/base-modal.container';
import { connect } from 'react-redux';
import $ from 'jquery';
import configureStore from '../store/configure-store';
import { deleteChannel } from '../actions/preferences-action';
import Log from '../shared/logger';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBaseWindowVisible: false,
      isLoaded: false,
      messages: [],
      username: null,
      channel: null,
      prefs: null
    };

    this.openBaseWindow = this.openBaseWindow.bind(this);
    this.closeBaseWindow = this.closeBaseWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage.bind(this));
  }

  handleLeavePage(e) {
    const store = configureStore();
    store.dispatch(deleteChannel(this.state.prefs.session));
    //const confirmationMessage = '';
    //e.returnValue = confirmationMessage;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.preferences.length > 0) {
      let prefs = nextProps.preferences[1]['data'];
      this.setState({ prefs: prefs });
      localStorage.setItem('prefs', JSON.stringify(prefs));

      this.popupDelay(prefs);
    }
  }

  popupDelay(prefs) {
    if (!prefs) return;

    const timeout = parseInt(prefs.popup_delay, 10) * 1000;
    if (timeout => 0 && this.state.isLoaded === false) {
      this.setState({ isLoaded: true });

      setTimeout(function() {
        if ($('.cpx_chat-anchor-container').length > 0) {
          Log.info('trigger chat after delay', 'App');
          $('.cpx_chat-anchor-container').trigger('click');
        }
      }, timeout);
    }
  }

  openBaseWindow() {
    this.setState({ isBaseWindowVisible: true });
  }

  closeBaseWindow() {
    this.setState({ isBaseWindowVisible: false });
  }

  render() {
    return (
      <div>
        {
          this.state.prefs && this.state.prefs.chat_on === true ? 
          <div>
            {
              <div style={{display: !this.state.isBaseWindowVisible ? 'block' : 'none' }}
                className="cpx_chat-anchor-container container-shadow noselect"
                onClick={this.openBaseWindow}
                >
                <i className="fas fa-comment-dots fa-2x" aria-hidden="true" />
                <span className="chat-text-chat">Chat</span>
              </div>
            }
            <div style={{display: this.state.isBaseWindowVisible ? 'block' : 'none' }}>
              {
                <BaseModalPage
                  prefs={this.state.prefs}
                  closeWindow={this.closeBaseWindow}
                />
              }
            </div>
          </div>
          : ''
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    preferences: state.preferences
  };
};

export default connect(mapStateToProps)(App);

