import React from 'react';
import { Platform } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation';
import { Entypo, Feather } from '@expo/vector-icons';

import MapStack from './MapStack';
import SavedStack from './SavedStack';

const HomeTabs = createBottomTabNavigator(
  {
    MapTab: {
      screen: MapStack,
      navigationOptions: {
        tabBarLabel: 'Map',
        tabBarIcon: ({ tintColor }) => <Entypo name='location' color={tintColor} size={Platform.OS === 'ios' ? 22 : 25} />
      }
    },
    SavedTab: {
      screen: SavedStack,
      navigationOptions: {
        tabBarLabel: 'Saved Stations',
        tabBarIcon: ({ tintColor }) => <Feather name='battery-charging' color={tintColor} size={Platform.OS === 'ios' ? 23 : 25} />
      }
    }
  },
  {
    initialRouteName: 'MapTab',
    tabBarPosition: 'bottom',
    animationEnabled: Platform.OS === 'ios' ? false : true,
    swipeEnabled: Platform.OS === 'ios' ? false : false,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      activeTintColor: '#ff165d',
      inactiveTintColor: '#999999',
      style: {
        backgroundColor: '#ffffff',
        padding: Platform.OS === 'ios' ? 5 : 0
      },
      indicatorStyle: {
        backgroundColor: 'white'
      },
      labelStyle: {
        fontSize: 12
      }
    }
  }
);

export default HomeTabs;
