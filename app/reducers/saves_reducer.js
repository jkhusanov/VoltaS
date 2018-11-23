import _ from 'lodash';
import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';
import { SAVE_STATION, CLEAR_SAVED_STATIONS } from '../actions/types';
export default function(state = [], action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.savedStations || [];
    case SAVE_STATION:
      return _.uniqBy([action.payload, ...state], 'id');
    case CLEAR_SAVED_STATIONS:
      return [];
    default:
      return state;
  }
}
