import { createStackNavigator } from 'react-navigation';

import MapScreen from '../screens/MapScreen';

const MapStack = createStackNavigator(
  {
    Map: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: 'Map'
  }
);
export default MapStack;
