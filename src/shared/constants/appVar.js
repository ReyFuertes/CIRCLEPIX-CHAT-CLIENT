export const chatTimeoutValue = 420;//7 minutes in seconds
export const leadValidationDelay = 1;//1 second

export const inputInfoErrorText = {
  empty_name: 'Name cannot be blank',
  empty_phone: 'Phone number cannot be blank',
  empty_email: 'Email address cannot be blank',
  invalid_name: 'Invalid name',
  invalid_phone: 'Invalid phone number',
  invalid_email: 'Invalid email address'
};

export const paramIdentity = () => {
  return Math.round(+new Date() / 1000);
};




