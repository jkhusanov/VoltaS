import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { MapView } from 'expo';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

class MapScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Map Screen'
  });

  state = {
    mapLoaded: false,
    isLoading: true,
    region: {
      latitude: null || 37.0902,
      longitude: null || -95.7129,
      latitudeDelta: null || 60,
      longitudeDelta: null || 60
    }
  };
  componentDidMount() {
    this.getCurrentLocation();
  }

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
  contentView = () => {
    const { region, mapLoaded, isLoading } = this.state;
    if (mapLoaded) {
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>;
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={isLoading ? region : this.regionFrom(region.latitude, region.longitude, 5000)}
          // onRegionChangeComplete={this.onRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation
        />
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
  }
});
export default MapScreen;
