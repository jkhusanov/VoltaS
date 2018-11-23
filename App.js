import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createAppContainer } from 'react-navigation';
import HomeTabs from './app/navigation/HomeTabs';
import configurationStore from './app/store';

const AppContainer = createAppContainer(HomeTabs);

export default class App extends React.Component {
  render() {
    const { persistor, store } = configurationStore();
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}
