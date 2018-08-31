import { combineReducers } from 'redux';
import preferences from './preference-reducer';

const rootReducer = combineReducers({
  preferences
});

export default rootReducer;
