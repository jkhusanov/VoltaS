import React from 'react';
import { View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import { clearSavedStations } from '../actions';
import { Button } from 'react-native-elements';

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Settings Screen'
  });
  onButtonPress = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to delete saved stations?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            console.log('Yes Pressed'),
              this.props.clearSavedStations(),
              this.props.navigation.goBack();
          }
        }
      ],
      { cancelable: false }
    );
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button
          title='Delete all saved stations'
          titleStyle={{ fontWeight: '600' }}
          icon={{ name: 'delete-forever', color: 'white' }}
          buttonStyle={{
            backgroundColor: '#F44336',
            width: 300,
            height: 45,
            alignSelf: 'center'
          }}
          onPress={this.onButtonPress}
        />
      </View>
    );
  }
}

export default connect(
  null,
  { clearSavedStations }
)(SettingsScreen);
