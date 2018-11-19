import { FETCH_STATIONS } from '../actions/types';

const INITIAL_STATE = { results: [] };

export default function(state = INITIAL_STATE.results, action) {
  switch (action.type) {
    case FETCH_STATIONS:
      return action.payload;
    default:
      return state;
  }
}
