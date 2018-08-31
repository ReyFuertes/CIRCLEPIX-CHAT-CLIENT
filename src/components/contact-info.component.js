import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import ToolTip from 'react-tooltip';
import configureStore from '../store/configure-store';
import { generateLead } from '../actions/preferences-action';
import * as constants from '../shared/constants/appVar';
import URLBuilder from '../shared/url-builder';
import WebUtility from '../shared/web-utility';

class ContactInfoComponent extends Component {
  inputClass = 'form-control cpx_fieldset-field_input';

  constructor(props) {
    super(props);

    this.state = {
      guestInfo: {name: '', phone: '', email: ''}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.componentClassName = this.getComponentClassName();
    this.setState( {guestInfo: this.props.guestInfo } );
  }

  handleChange(field, value) {
    if ((field === 'phone') && (value != null)) {
      //modify format of value
      value = value.replace(/\D+/g, '');
    }

    let info = this.state.guestInfo;
    info[field] = value;
    this.setState({ guestInfo: info });
  }

  handleSubmit() {
    if (this.isLeadInfoValid()) {
      this.generateNewLead();
      this.props.onSubmit(this.props.leadInfoType, this.state.guestInfo);
    }
  }

  generateNewLead() {
    const store = configureStore();
    const leadInfo = {
      'url': URLBuilder.getSourceURL(),
      'name': this.state.guestInfo['name'],
      'email': this.state.guestInfo['email'],
      'phone': this.state.guestInfo['phone'],
      'tourid': +WebUtility.getTourInfo().tourId,
      'source': "tour chat",
      'address': WebUtility.getTourInfo().address
    }
    store.dispatch(generateLead(leadInfo));
  }

  getComponentClassName() {
    const type = this.props.leadInfoType;
    var className = '';
    if(type === 'Update') {
      className = 'cpx_content-update-contact-info';
    } else {
      className = 'cpx_content-contact-info';
    }
    return className;
  }

  getInputStatus(field) {
    var status = '';

    switch(field) {
      case 'name':
        status = this.getNameStatus(this.state.guestInfo[field]);
        break;
      case 'phone':
        status = this.getPhoneStatus(this.state.guestInfo[field]);
        break;
      case 'email':
        status = this.getEmailStatus(this.state.guestInfo[field]);
        break;
      default:
        status = 'input-invalid'
        break;
    }
    return status;
  }

  getNameStatus(value) {
    var status = 'input-invalid';
    if (value == null) {
      return status;
    }

    if (value !== '') {
      status = 'input-valid';
    } else {
      status = 'input-empty';
    }
    return status;
  }

  getPhoneStatus(value) {
    var status = 'input-invalid';
    if (value == null) {
      return status;
    }

    const cleanPNum = value.replace(/\D+/g, '');
    if (cleanPNum.length === 10) {
      status = 'input-valid';
    } else if (cleanPNum.length === 0) {
      status = 'input-empty';
    } else {
      status = 'input-invalid';
    }
    return status;
  }
  
  getEmailStatus(value) {
    var status = 'input-invalid';
    if (value == null) {
      return status;
    }

    const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if ((emailValid !== null) && (value !== '')) {
      status = 'input-valid';
    } else if(value === '') {
      status = 'input-empty';
    } else {
      status = 'input-invalid';
    }
    return status;
  }

  getInputStatusString(inputField) {
    var statusString = '';

    let inputStatus = this.getInputStatus(inputField);
    if (inputStatus != null) {
      var status = inputStatus.split('-')[1];
      statusString = constants.inputInfoErrorText[`${status}_${inputField}`];
    } else {
      statusString = '';
    }
    return statusString;
  }

  isLeadInfoValid() {
    let inputNameStatus = this.getInputStatus('name');
    let inputPhoneStatus = this.getInputStatus('phone');
    let inputEmailStatus = this.getInputStatus('email');
    return ((inputNameStatus === 'input-valid') &&
            (inputPhoneStatus === 'input-valid') &&
            (inputEmailStatus === 'input-valid'));
  }


  render() {
    let divClassName = `${this.componentClassName} cpx_contact-info col-xs-12`;
    let nameClassName = `${this.inputClass} ${this.getInputStatus('name')}`;
    let phoneClassName = `${this.inputClass} ${this.getInputStatus('phone')}`;
    let emailClassName = `${this.inputClass} ${this.getInputStatus('email')}`;
    let isLeadValid = this.isLeadInfoValid();

    return (
      <div className={ divClassName }>
        <form autoComplete="off">
          <h4 className="center-text">Please enter your contact information</h4>
          <div className="col-xs-12 form-group">
            <input
              type="text"
              ref="guestName"
              name="guestName"
              value={this.state.guestInfo['name']}
              className={ nameClassName }
              id="cpx_input-guest-name"
              onChange={e => {
                this.handleChange('name', e.target.value)
              }}
              autoComplete="off"
              data-tip="" data-for="inputName"
            />
            <span className="floating-label">Name</span>
            <ToolTip id="inputName" type="error" place="bottom"
              getContent={() => {return this.getInputStatusString('name')}}>   
            </ToolTip>
          </div>

          <div className="col-xs-12 form-group">
            <InputMask 
              id="cpx_input-guest-phone"
              ref="guestPhone"
              className={ phoneClassName }
              onChange={e => {
                this.handleChange('phone', e.target.value);
              }}
              value={this.state.guestInfo['phone']}
              mask="(999) 999 - 9999" 
              maskChar=" " 
              data-tip="" data-for="inputPhone"
            />
            <span className="floating-label">Phone</span>
            <ToolTip id="inputPhone" type="error" place="bottom"
              getContent={() => {return this.getInputStatusString('phone')}}> 
            </ToolTip>
          </div>

          <div className="col-xs-12 form-group">
            <input
              type="text"
              ref="guestEmail"
              className={ emailClassName }
              id="guestEmail"
              onChange={e => {
                this.handleChange('email', e.target.value);
              }}
              value={this.state.guestInfo['email']}
              data-tip="" data-for="inputEmail"
            />
            <span className="floating-label">Email Address</span>
            <ToolTip id="inputEmail" type="error" place="bottom"
              getContent={() => {return this.getInputStatusString('email')}}> 
            </ToolTip>
          </div>

          <div className="col-xs-12 text-center">
            <button
              disabled={ !isLeadValid }
              id="btn-form-submit"
              type="button"
              onClick={this.handleSubmit}
              className="btn btn-success cpx_btn-success">
                { this.props.buttonText }
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ContactInfoComponent;
