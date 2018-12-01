import React from 'react';
import { View, Text, Platform, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import openMap from 'react-native-open-maps';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

class SavedScreen extends React.Component {
  state = {
    result: null
  };
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Saved Stations',
    headerRight: (
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Settings"
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

  gotoStation = (street, city, state, zip) => {
    openMap({
      travelType: ['drive'],
      end: `${street}, ${city}, ${state}, ${zip}`
    });
  };
  renderLikedJobs() {
    return this.props.savedStations.map(station => {
      const { id, name, status, location, street_address, city, state, zip_code } = station;
      const initialRegion = {
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
        latitudeDelta: 0.07,
        longitudeDelta: 0.05
      };
      return (
        <Card key={id} title={name} containerStyle={styles.cardStyle}>
          <View style={styles.mapViewStyle}>
            <MapView
              style={{ flex: 1 }}
              cacheEnabled={Platform.OS === 'ios'}
              scrollEnabled={false}
              initialRegion={initialRegion}
              loadingEnabled={true}
              liteMode={true}
            >
              <MapView.Marker key={station.id} coordinate={initialRegion}>
                <View style={styles.markerWrap}>
                  <View style={styles.markerCenter}>
                    <FontAwesome
                      name="bolt"
                      size={Platform.OS === 'ios' ? 10 : 11}
                      style={styles.boltIcon}
                      color="#26baee"
                    />
                  </View>
                </View>
              </MapView.Marker>
            </MapView>
          </View>
          <View style={{ height: 130, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.detailWrapper}>
              <Text style={styles.stationAddress}>{street_address}</Text>
              <Text style={styles.stationAddress}>
                {city}, {state} {zip_code}
              </Text>
              <Text style={styles.stationStatus}>{status}</Text>
            </View>
            <Button
              title="Directions"
              buttonStyle={styles.directionsButton}
              onPress={() => this.gotoStation(street_address, city, state, zip_code)}
              titleStyle={styles.buttonTitle}
            />
          </View>
        </Card>
      );
    });
  }
  render() {
    return (
      <View>
        <ScrollView>{this.renderLikedJobs()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {},
  mapViewStyle: {
    height: height / 4 + 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'white',
    overflow: 'hidden'
  },
  detailWrapper: {
    marginVertical: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  italics: {
    fontStyle: 'italic',
    fontSize: 18
  },
  normal: {
    fontStyle: 'normal',
    fontSize: 16
  },
  directionsButton: {
    backgroundColor: '#ff165d', // or 157EFB
    width: 250,
    height: height / 18 + 5,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10,
    elevation: 0
  },
  buttonTitle: {
    fontWeight: '700',
    color: 'white'
  },
  stationAddress: {
    fontSize: 15
  },
  stationStatus: {
    fontSize: 18,
    color: '#0CE89C'
  },
  markerWrap: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
    borderColor: '#26baee',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 5,
    width: 32,
    height: 32,
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: Platform.OS === 'ios' ? 0 : 12
  },
  markerCenter: {
    width: 15,
    height: 15,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#f47645',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boltIcon: {
    alignSelf: 'center',
    transform: [{ rotate: '45deg' }]
  }
});

function mapStateToProps(state) {
  return { savedStations: state.savedStations };
}

export default connect(mapStateToProps)(SavedScreen);
