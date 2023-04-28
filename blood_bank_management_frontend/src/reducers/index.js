import progressReducer from './progress';
import { combineReducers } from 'redux';
import popupReducer from './popup';

const allReducers = combineReducers({
    progress: progressReducer,
    popupState: popupReducer
});

export default allReducers;