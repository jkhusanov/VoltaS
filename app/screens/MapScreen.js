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
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import ClusteredMapView from 'react-native-maps-super-cluster';

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
    ready: true,
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

  getCurrentLocation = () => {
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
  };
  regionFrom = (lat, lon, distance) => {
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
  };

  gotoStation = (street, city, state, zip) => {
    openMap({
      travelType: ['drive'],
      end: `${street}, ${city}, ${state}, ${zip}`
    });
  };

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    return (
      <MapView.Marker identifier={`cluster-${clusterId}`} coordinate={coordinate} onPress={onPress}>
        <View style={styles.clusterContainer}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#ff165d',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={styles.clusterText}>{pointCount}</Text>
          </View>
        </View>
      </MapView.Marker>
    );
  };
  renderMarker = pin => {
    return (
      <MapView.Marker
        key={pin.value.id}
        coordinate={pin.location}
        onPress={() => {
          this.setState({
            stationInfo: pin.value,
            isOpen: true
          });
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%, 50%, 50%, 0',
            borderWidth: 1,
            borderColor: '#ff165d',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            transform: [{ rotate: '-45deg' }],
            top: '40%',
            left: '30%'
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#ff165d',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </View>
      </MapView.Marker>
    );
  };

  stationInfoRender() {
    const { stationInfo, isOpen } = this.state;
    return (
      <Modal
        isOpen={isOpen}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 250
              }}
            >
              <TouchableOpacity onPress={() => this.props.saveStation(stationInfo)}>
                <View style={styles.saveButton}>
                  <Feather
                    name='bookmark'
                    size={Platform.OS === 'ios' ? 20 : 22}
                    style={styles.buttonIconStyle}
                  />
                  <Text style={[styles.buttonTitle, { color: 'black', fontSize: 16 }]}>Save</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.gotoStation(
                    stationInfo.street_address,
                    stationInfo.city,
                    stationInfo.state,
                    stationInfo.zip_code
                  )
                }
              >
                <View style={styles.directionsButton}>
                  <Entypo
                    name='direction'
                    size={Platform.OS === 'ios' ? 20 : 22}
                    style={styles.buttonIconStyle}
                    color='white'
                  />
                  <Text style={styles.buttonTitle}>Go</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  _convertPoints(data) {
    const results = {
      type: 'MapCollection',
      features: []
    };
    data.map(value => {
      array = {
        value,
        location: {
          latitude: value.location.coordinates[1],
          longitude: value.location.coordinates[0]
        }
      };
      results.features.push(array);
    });
    return results.features;
  }

  clusteredMarkers() {
    const data = this._convertPoints(this.props.stations);
    const { region, mapLoaded, isLoading, distance, stationInfo } = this.state;
    if (mapLoaded) {
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>;
    }
    return (
      <View style={styles.container} style={{ flex: 1 }}>
        <ClusteredMapView
          style={{ flex: 1 }}
          data={data}
          renderMarker={this.renderMarker.bind(this)}
          renderCluster={this.renderCluster.bind(this)}
          initialRegion={region}
          // region={region}
          // onRegionChange={this.onRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={true}
          maxZoom={16}
        />
        {this.stationInfoRender()}
      </View>
    );
  }
  render() {
    const { isLoading } = this.state;
    // return <View style={{ flex: 1 }}>{this.clusteredMarkers()}</View>;
    return isLoading === true ? (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    ) : (
      <View style={{ flex: 1 }}>{this.clusteredMarkers()}</View>
    );
  }
}
const styles = StyleSheet.create({
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
  saveButton: {
    flexDirection: 'row',
    backgroundColor: 'white', // or 157EFB
    width: 100,
    height: height / 18 + 5,
    borderColor: '#ff165d',
    borderWidth: 0.5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: '#ff165d', // or 157EFB
    width: 100,
    height: height / 18 + 5,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: {
    fontWeight: '700',
    color: 'white',
    fontSize: 20
  },
  buttonIconStyle: {
    marginRight: 10
  },
  stationName: {
    fontWeight: '700',
    fontSize: 20
  },
  stationStatus: {
    fontSize: 18,
    color: '#0CE89C'
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  clusterText: {
    fontSize: 14,
    color: '#008276',
    fontWeight: '700',
    textAlign: 'center'
  },
  controlBar: {
    top: 24,
    left: 25,
    right: 25,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  clusterContainer: {
    width: 30,
    height: 30,
    borderWidth: 4,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#87e5da',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)'
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)'
  }
});

function mapStateToProps({ stations }) {
  return { stations: stations };
}
export default connect(
  mapStateToProps,
  actions
)(MapScreen);
