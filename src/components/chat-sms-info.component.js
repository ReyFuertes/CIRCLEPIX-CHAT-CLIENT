import React, { Component } from 'react';

class ChatBoxMsgInfo extends Component {

  componentDidMount() {
    document.getElementById(this.props.compId).scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  render() {
    return (
      <div>
        {this.props.isAgent === true ? (
          <div
            id={this.props.compId}
            className="chat-window-timeline col-xs-12">
            <div className="col-xs-2">
              <div className="img-container">
                <h4 className="img-name">{this.props.agentName[0]}</h4>
              </div>
            </div>
            <div className="col-xs-9">
              <div className="well">{this.props.msgInfo}</div>
            </div>
          </div>
        ) : (
          <div
            id={this.props.compId}
            className="chat-window-timeline col-xs-12">
            <div className="col-xs-9 col-xs-offset-1">
              <div className="well">{this.props.msgInfo}</div>
            </div>
            <div className="col-xs-2">
              <div className="">
                <i className="fas fa-user-circle fa-3x" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ChatBoxMsgInfo;
