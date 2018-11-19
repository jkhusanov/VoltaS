import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const reducer = combineReducers(reducers);
export default function configurationStore(initialSate = {}) {
  const store = createStore(reducer, initialSate, applyMiddleware(thunk));
  return { store };
}
