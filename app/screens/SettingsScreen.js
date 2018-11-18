import React from 'react';
import { View, Text } from 'react-native';

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Settings Screen'
  });
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Settings Screen where clear saved button will be located</Text>
      </View>
    );
  }
}

export default SettingsScreen;
