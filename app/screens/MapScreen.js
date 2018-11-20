import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { MapView } from 'expo';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import * as actions from '../actions';

const { width } = Dimensions.get('window');

class MapScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Map Screen'
  });

  state = {
    mapLoaded: false,
    isLoading: true,
    isModalVisible: false,
    distance: 5000,
    stationInfo: '',
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

  contentView = () => {
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
                  stationInfo: station
                }),
                  this._toggleModal();
              }}
            />
          ))}
        </MapView>

        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.bottomModal}
          backdropColor={'transparent'}
          onBackdropPress={this._toggleModal}
        >
          <View style={styles.modalContent}>
            <Text>{stationInfo.name}</Text>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text>Hide me!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };
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
  customView: {
    width: 140,
    height: 100
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 100
  }
});

function mapStateToProps({ stations }) {
  return { stations: stations };
}
export default connect(
  mapStateToProps,
  actions
)(MapScreen);
