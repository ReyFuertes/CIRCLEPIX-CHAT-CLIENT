import React, { Component } from 'react';

class OfflineFormComponent extends Component {
  inputClass = 'form-control cpx_fieldset-field_input';

  constructor(props) {
    super(props);

    this.state = {
      guestName: '',
      guestPhone: '',
      guestEmail: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  onChange = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    return (
      <div className="cpx_content-contact-info col-xs-12 content-container">
        {(this.props.prefs.require_lead === true &&
          this.props.prefs.is_online === false &&
          this.props.prefs.phone_number !== '') ||
        this.props.prefs.require_lead === true ? (
          <form onSubmit={this.handleSubmit} autoComplete="off">
            <h4 className="center-text">
              Please enter your contact information
            </h4>
            <div className="col-xs-12 form-group">
              <input
                type="text"
                ref="guestName"
                name="guestName"
                value={this.state.guestName}
                className={
                  this.state.guestName === ''
                    ? `${this.inputClass} cpx_input-empty`
                    : this.inputClass
                }
                id="cpx_input-guest-name"
                onChange={e => {
                  this.onChange('guestName', e.target.value);
                }}
              />
              <span className="floating-label">Name</span>
            </div>
            <div className="col-xs-12 form-group">
              <input
                type="text"
                ref="guestPhone"
                name="guestPhone"
                className={
                  this.state.guestPhone === ''
                    ? `${this.inputClass} cpx_input-empty`
                    : this.inputClass
                }
                id="cpx_input-guest-phone"
                onChange={e => {
                  this.onChange('guestPhone', e.target.value);
                }}
              />
              <span className="floating-label">Phone</span>
            </div>
            <div className="col-xs-12 form-group">
              <input
                type="text"
                ref="guestEmail"
                className={
                  this.state.guestEmail === ''
                    ? `${this.inputClass} cpx_input-empty`
                    : this.inputClass
                }
                id="cpx_input-guest-email"
                onChange={e => {
                  this.onChange('guestEmail', e.target.value);
                }}
              />
              <span className="floating-label">Email Address</span>
            </div>
            <div className="col-xs-12 text-center">
              <button
                id="btn-start-chat"
                type="submit"
                className="btn btn-success cpx_btn-success">
                SEND
              </button>
            </div>
          </form>
        ) : (
          ''
        )}
        {(this.props.prefs.require_lead === true &&
          this.props.prefs.is_online === false) ||
        this.props.prefs.is_online === false ||
        this.props.prefs.phone_number === '' ||
        (this.props.prefs.is_online === false &&
          this.props.prefs.require_lead === false) ? (
          <div className="col-xs-12 offline-msg">
            <h4>
              <span className="offline-name">{this.props.prefs.name}</span> from
              Circlepix
            </h4>
            <p>{this.props.prefs.offline_message}</p>
          </div>
        ) : (
          ''
        )}
        {this.state.isTimeout === true ? (
          <div className="timeout-container">Session Timeout..</div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default OfflineFormComponent;
