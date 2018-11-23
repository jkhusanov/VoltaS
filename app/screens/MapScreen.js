import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  YellowBox
} from 'react-native';
import { MapView } from 'expo';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Modal from 'react-native-modalbox';
import openMap from 'react-native-open-maps';
import { AntDesign } from '@expo/vector-icons';

import * as actions from '../actions';

const { width, height } = Dimensions.get('window');
YellowBox.ignoreWarnings(['Require cycle: node_modules/react-native-gesture-handler']);

class MapScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'VoltaS'
  });

  state = {
    mapLoaded: false,
    isLoading: true,
    isModalVisible: false,
    distance: 5000,
    stationInfo: '',
    isOpen: false,
    region: {
      latitude: null || 37.0902,
      longitude: null || -95.7129,
      latitudeDelta: null || 60,
      longitudeDelta: null || 60
    }
  };
  componentDidMount() {
    this.getCurrentLocation();
    this.loadStations();
  }

  loadStations = () => {
    this.props.fetchStations(() => {
      // console.log(this.props.stations);
    });
  };

  onRegionChangeComplete = region => {
    this.setState({ region });
  };

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (position.coords.latitude && position.coords.longitude) {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }
          });
        }
        this.setState({ isLoading: false, mapLoaded: true });
      },
      error => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }
  regionFrom(lat, lon, distance) {
    distance = distance / 2;
    const circumference = 40075;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const angularDistance = distance / circumference;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = Math.abs(
      Math.atan2(
        Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
      )
    );

    return (result = {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta
    });
  }

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });
  gotoStation = (street, city, state, zip) => {
    openMap({
      travelType: ['drive'],
      end: `${street}, ${city}, ${state}, ${zip}`
    });
  };
  contentView() {
    const { region, mapLoaded, isLoading, distance, stationInfo } = this.state;
    if (mapLoaded) {
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>;
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={isLoading ? region : this.regionFrom(region.latitude, region.longitude, distance)} //3rd arg smaller  = more closer distance
          // onRegionChangeComplete={this.onRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {this.props.stations.map(station => (
            <MapView.Marker
              key={station.id}
              coordinate={{
                latitude: station.location.coordinates[1],
                longitude: station.location.coordinates[0]
              }}
              // title={station.name}
              onPress={() => {
                this.setState({
                  region: {
                    latitude: station.location.coordinates[1],
                    longitude: station.location.coordinates[0]
                  },
                  distance: 250,
                  stationInfo: station,
                  isOpen: true
                });
              }}
            />
          ))}
        </MapView>

        <Modal
          isOpen={this.state.isOpen}
          onClosed={() => this.setState({ isOpen: false })}
          style={styles.modal}
          backdrop={false}
          position={'bottom'}
          swipeToClose={true}
          swipeThreshold={25}
        >
          <View style={styles.modalContent}>
            <View style={styles.closeModal}>
              <AntDesign name='minus' size={Platform.OS === 'ios' ? 55 : 60} />
            </View>
            <View style={styles.stationInfoStyle}>
              <Text style={styles.stationName}>{stationInfo.name}</Text>
              <Text style={styles.stationStatus}>{stationInfo.status}</Text>
              <Button
                title='Directions'
                buttonStyle={styles.directionsButton}
                onPress={() =>
                  this.gotoStation(
                    stationInfo.street_address,
                    stationInfo.city,
                    stationInfo.state,
                    stationInfo.zip_code
                  )
                }
                titleStyle={styles.buttonTitle}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  render() {
    const { isLoading } = this.state;

    return <View style={{ flex: 1 }}>{this.contentView()}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    height: height / 6 + 15,
    backgroundColor: 'transparent'
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: 'white',
    borderTopWidth: 1
  },

  closeModal: {
    position: 'absolute',
    paddingBottom: height / 7
  },

  stationInfoStyle: {
    alignItems: 'center'
  },
  locationTextContainer: {
    paddingHorizontal: 10
  },
  directionsButton: {
    backgroundColor: '#ff165d', // or 157EFB
    width: 250,
    height: height / 18 + 5,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10
  },
  buttonTitle: {
    fontWeight: '700',
    color: 'white'
  },
  stationName: {
    fontWeight: '700',
    fontSize: 20
  },
  stationStatus: {
    fontSize: 18,
    color: '#0CE89C'
  }
});

function mapStateToProps({ stations }) {
  return { stations: stations };
}
export default connect(
  mapStateToProps,
  actions
)(MapScreen);
