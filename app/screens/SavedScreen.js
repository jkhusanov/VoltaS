import React from 'react';
import { View, Text, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-elements';

class SavedScreen extends React.Component {
  state = {
    result: null
  };
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Saved Stations',
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Settings')}
        title='Settings'
        titleStyle={{ color: 'rgba(0, 122, 255, 1)' }}
        buttonStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0)'
        }}
        clear
      />
    ),
    headerStyle: {
      // marginTop: Platform.OS === 'android' ?  Expo.Constants.statusBarHeight : 0
    }
  });
  render() {
    return (
      <View style={styles.container}>
        <Text>Saved Stations Screen</Text>
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

export default SavedScreen;
