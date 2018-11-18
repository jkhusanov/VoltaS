import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MapView } from 'expo';
import { Button } from 'react-native-elements';

class MapScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Map Screen'
  });
  render() {
    return (
      <View style={styles.container}>
        <Text>Map Screen</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default MapScreen;
