import React, { Component } from 'react';
import ContactInfoComponent from '../components/contact-info.component';
import ChatWindowComponent from '../components/chat-window.component';

class BaseModalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      agentStatus: 'Offline',
      guestInfo: {name: '', phone: '', email: ''},
      isChatWindowVisible: false,
      isLeadFormVisible: true
    };

    this.handleCloseIconClick = this.handleCloseIconClick.bind(this);
	  this.handleChatWindowClick = this.handleChatWindowClick.bind(this);
	
    this.handleLeadFormSubmit = this.handleLeadFormSubmit.bind(this);
    this.handleLeadFormLinkClick = this.handleLeadFormLinkClick.bind(this);
  }

  componentDidMount() {
    this.leadFormLinkText = 'Add';

    if ((this.props.prefs != null) && (this.props.prefs.phone_number != null) && 
        (this.props.prefs.is_online)) {
      this.setState({ agentStatus: 'Online' });
    } else {
      this.setState({ agentStatus: 'Offline' });
    }

    if (this.props.prefs.require_lead) {
      this.setState({ isChatWindowVisible: false, isLeadFormVisible: true });
    } else {
      this.setState({ isChatWindowVisible: true, isLeadFormVisible: false });
    }
  }

  handleCloseIconClick() {
    this.props.closeWindow();
  }
  
  handleChatWindowClick() {
    //hide lead form
    this.setState({ isLeadFormVisible: false });
  }

  handleLeadFormSubmit(type, guestInfo) {
    //update link text depending if there is lead info already
    if ((guestInfo['name'] !== '') ||
        (guestInfo['phone'] !== '') ||
        (guestInfo['email'] === '')) {
      this.leadFormLinkText = 'Edit'
    } else {
      this.leadFormLinkText = 'Add'
    }

    if ((type === 'Update') || (type === 'Initial')) {
      this.showChatWindowOnly();
    }
    this.setState({guestInfo});
  }

  handleLeadFormLinkClick() {
    this.setState({ 
      isChatWindowVisible: true,
      isLeadFormVisible: true
    });
  }

  showChatWindowOnly() {
    this.setState({ 
      isChatWindowVisible: true,
      isLeadFormVisible: false
    });
  }

  render() {
    return (
      <div className="cpx_chat-msg-container container-shadow">
        <div className="cpx_chat-msg-header col-xs-12">
          <div className="col-xs-2 padding-0">
            <i
              className="fas fa-comment-dots fa-2x cpx_chat-msg-icon"
              aria-hidden="true"
            />
          </div>
          <div className="col-xs-8 padding-0">
            <span className="chat-text-name cpx_bold">
              {this.props.prefs.name}
            </span>
            <span className="chat-text-status">{this.state.agentStatus}</span>
          </div>
          <div
            onClick={this.handleCloseIconClick}
            className="col-xs-2 cpx_chat-msg-close padding-right-5 text-align-right cpx_cursor-pointer">
            <i className="fa fa-times fa-2x" aria-hidden="true" />
          </div>
          {this.props.prefs.is_online && !this.state.isLeadFormVisible ? (
            <div className="col-xs-12 clear text-align-right">
              <span className="additional-info" onClick={this.handleLeadFormLinkClick}>
                {this.leadFormLinkText} Contact Information
              </span>
              <i className="fas fa-chevron-circle-right" />
            </div>
          ) : (
            ''
          )}
        </div> 
        {this.state.isLeadFormVisible && this.state.isChatWindowVisible ? 
          <ContactInfoComponent 
            leadInfoType="Update"
            guestInfo={this.state.guestInfo}
            onSubmit={this.handleLeadFormSubmit}
            buttonText="SEND"
          /> 
          : ''
        }

        <div className="cpx_modal-content">
          {this.state.isChatWindowVisible === false &&
          this.state.isLeadFormVisible === true &&
          this.props.prefs.phone_number !== '' &&
          this.props.prefs.require_lead === true &&
          this.props.prefs.is_online === true ? (
            <ContactInfoComponent
              leadInfoType="Initial"
              guestInfo={this.state.guestInfo}
              onSubmit={this.handleLeadFormSubmit}
              buttonText="START CHAT"
            />
          ) : (
            <ChatWindowComponent
              prefs={this.props.prefs}
              agentStatus={this.state.agentStatus}
              isLeadFormVisible={this.state.isLeadFormVisible}
              onChatClick={this.handleChatWindowClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default BaseModalPage;
