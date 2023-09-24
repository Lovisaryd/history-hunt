import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useEffect, useState, useLayoutEffect } from 'react';
import { Image, View, Text } from 'react-native';
import { findAddress } from '../functions/location';
import { useNavigation} from '@react-navigation/native';
import { Pressable } from 'react-native';
import * as Location from 'expo-location';
import addIcon from '../assets/icons8-checkmark-24.png'
import customMap from '../customMap.json'
import { randomColor } from '../functions/randomColor';

const MapScreen = ({ setNewHuntObj, newHuntObj, route, checkedOff }) => {
  const [pickedLoc, setPickedLoc] = useState([]);
  const [contextCreate, setContextCreate] = useState(true)
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(false)
  const [clickedLoc, setClickedLoc] = useState(null)
  const [confirmedLat, setConfirmedLat] = useState(null)
  const context = route.params.context;
  const huntObj = route.params.hunt
  const markers = route.params.markers
  const navigation = useNavigation()

  useEffect(() => {
    if(context === 'play'){
      setContextCreate(false)
    } else {
      setContextCreate(true)
    }
    getCurrentLocation();
    
  },[])

    const initialRegion = {
    latitude: markers ? markers[0].lat : 57.6916305668,
    longitude: markers ? markers[0].long : 11.974412769,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.012,
  };

  const handlePress = () => {
        if(newHuntObj.checkpoints.length === pickedLoc.length){
            navigation.navigate('InvitePlayers')
        }
        
  }

  useLayoutEffect(() => {
    if(context === 'create'){
      navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => handlePress()}>
          <Image source={addIcon} style={{width: 24, height: 24}} />
        </Pressable>
      ),
    });
    } else{
      navigation.setOptions({
        headerTitle:''
      })
    }
  }, [navigation]);
  
  // directions unless you're there, rounds up because otherwise it's hard to try it lol
  const roundToDecimal = (value, decimalPlaces) => {
    const factor = 10 ** decimalPlaces;
    return Math.round(value * factor) / factor;
  }
  
  const atLocation = (location) => {
    const LATITUDE_TOLERANCE = 0.001;
    const LONGITUDE_TOLERANCE = 0.001; 
  
    const roundedCurrentLat = roundToDecimal(currentLocation.latitude, 4);
    const roundedCurrentLong = roundToDecimal(currentLocation.longitude, 4);
    const roundedTargetLat = roundToDecimal(location.lat, 4);
    const roundedTargetLong = roundToDecimal(location.long, 4);
  
    if (
      Math.abs(roundedCurrentLat - roundedTargetLat) <= LATITUDE_TOLERANCE &&
      Math.abs(roundedCurrentLong - roundedTargetLong) <= LONGITUDE_TOLERANCE
    ) {
      setDirections(false);
      setConfirmedLat(location.lat)
      navigation.navigate('CameraScreen', { context: 'play', lat: location.lat, markers:markers, hunt: huntObj });
    } else {
      setDirections(true);
      setClickedLoc({ latitude: location.lat, longitude: location.long });
    }
  }

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.watchPositionAsync(
          { enableHighAccuracy: true },
          (location) => {
            setCurrentLocation(location.coords);
          }
        );
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };


  const setMarkers = async (event) => {
    if(contextCreate){
      const lat = event.nativeEvent.coordinate.latitude;
    const long = event.nativeEvent.coordinate.longitude;
    const address = await findAddress({lat, long})
    if(address != undefined){
      const newPickedLoc = [...pickedLoc, { lat, long, address }]
       setPickedLoc(newPickedLoc)
       setNewHuntObj({...newHuntObj, checkpoints: newPickedLoc})
    }
    }
  };

  const removeMarker = (index) => {
    const newPickedLoc = [...pickedLoc];
    newPickedLoc.splice(index, 1);
    setPickedLoc(newPickedLoc);
    setNewHuntObj({...newHuntObj, checkpoints: newPickedLoc})
  };

  
  const Clue = () => {
    const checkpoints = huntObj.hunt.checkpoints
    const checkpoint = checkpoints.find((checkpoint) => {
      return(checkpoint.lat === clickedLoc.latitude)
    })
    const address = checkpoint.address.split(' ');
    return (
      <View style={{ position: 'absolute', zIndex: 1, alignSelf: 'center', backgroundColor:'#669bbc', opacity: 0.7, width: '100%', paddingTop: 50, paddingBottom: 20 }}>
        <Text style={{textAlign: 'center'}}>NEXT CLUE</Text>
        <Text style={{textAlign: 'center'}}>Make your way to</Text>
        <Text style={{textAlign: 'center'}}>{address[0]}</Text>
      </View>
    );
  };
  
  return (
    <View>
      {directions === true && <Clue/>}
    <MapView style={{ width: '100%', height: '100%' }} initialRegion={initialRegion} onPress={setMarkers} customMapStyle={customMap}>
      {contextCreate && pickedLoc.map((location, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: location.lat, longitude: location.long }}
          onPress={() => removeMarker(index)}
        />
      ))}
     {!contextCreate && markers.map((location, index) => (
  !checkedOff.some((item) => item.id === huntObj.hunt.id && item.locations.includes(location.lat)) && (
    <Marker
      key={index}
      coordinate={{ latitude: location.lat, longitude: location.long }}
      pinColor={randomColor()}
      onPress={() => atLocation(location)}
    />
  )
))}
      {currentLocation && (
    <Marker
      coordinate={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }}
      title="Me"
      >
        <Image
          source={require('../assets/icons8-map-pin.gif')}
          style={{width: 30, height: 30}}
       />
      </Marker>
  )}
    {directions && <MapViewDirections
      origin={{latitude: currentLocation.latitude, longitude: currentLocation.longitude}}
      destination={clickedLoc}
      strokeWidth={2}
      strokeColor="pink"
      apikey='"YOUR_API_HERE"'
    />}
    </MapView>
    </View>
  );
};

export default MapScreen;
