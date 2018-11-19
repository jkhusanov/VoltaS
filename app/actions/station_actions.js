import axios from 'axios';
import { FETCH_STATIONS } from './types';

const STATIONS_ROOT_URL = 'https://api.voltaapi.com/v1/stations';

export const fetchStations = callback => async dispatch => {
  try {
    let { data } = await axios.get(STATIONS_ROOT_URL);
    dispatch({ type: FETCH_STATIONS, payload: data });
    callback();
  } catch (error) {
    console.log(error);
  }
};
