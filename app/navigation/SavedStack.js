import { createStackNavigator } from 'react-navigation';

import SavedScreen from '../screens/SavedScreen';
import SettingsScreen from '../screens/SettingsScreen';

const SavedStack = createStackNavigator(
  {
    Saved: {
      screen: SavedScreen
    },
    Settings: {
      screen: SettingsScreen
    }
  },
  {
    initialRouteName: 'Saved'
  }
);
export default SavedStack;

SavedStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};
