import axios from 'axios';
import { FETCH_STATIONS, SAVE_STATION, CLEAR_SAVED_STATIONS } from './types';

const STATIONS_ROOT_URL = 'https://api.voltaapi.com/v1/stations?status=a';

export const fetchStations = callback => async dispatch => {
  try {
    let { data } = await axios.get(STATIONS_ROOT_URL);
    dispatch({ type: FETCH_STATIONS, payload: data });
    callback();
  } catch (error) {
    console.log(error);
  }
};

export const saveStation = station => {
  return {
    payload: station,
    type: SAVE_STATION
  };
};

export const clearSavedStations = () => {
  return { type: CLEAR_SAVED_STATIONS };
};
