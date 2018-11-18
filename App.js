import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import HomeTabs from './app/navigation/HomeTabs';

const AppContainer = createAppContainer(HomeTabs);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
