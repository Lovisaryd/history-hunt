import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polyline} from "react-native-maps";
import customMap from '../customMap.json'
import { randomColor } from "../functions/randomColor";
import { CustomButton } from "../ui/CustomButton";

const ConfirmHunt = ({route, styles}) => {
    const {hunt} = route.params.hunt
    const locs = hunt.checkpoints
    const markers = locs.map(({ lat, long }) => ({ lat, long }));
    let lastIndex = locs.length - 1
    const navigation = useNavigation()

    const initialRegion = {
        latitude: 57.6916305668,
        longitude: 11.974412769,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.012,
      };

    return(
        <View>
            <MapView style={{ width: '100%', height: '100%' }} initialRegion={initialRegion} customMapStyle={customMap}>
      {markers.map((location, index) => (
        <Marker
          key={index}
          pinColor={randomColor()}
          coordinate={{ latitude: location.lat, longitude: location.long }}
        />
      ))}
      <Polyline
    coordinates={markers.map(location => ({
      latitude: location.lat,
      longitude: location.long,
    }))}
    strokeWidth={2}
    strokeColor="purple"
  />
    </MapView>
    <View style={{position:'absolute', zIndex: 1, marginTop: '110%', alignSelf: 'center', width: '90%', backgroundColor: 'rgb(37,37,37)', borderRadius: 20, paddingLeft: 20, paddingTop: 20, paddingRight: 10, marginBottom: 20, paddingBottom: 10}}>
            <Text style={{color: '#b671b6', textAlign: 'center', marginBottom: 5}}>You picked</Text>
            <Text style={styles.subHeader}>{hunt.title}</Text>
            <Text style={styles.huntText}>• {locs[0].address}</Text>
            <Text style={styles.huntText}>•</Text>
            <Text style={styles.huntText}>•</Text>
            <Text style={styles.huntText}>• {locs[lastIndex].address}</Text>
            <Text style={{textAlign: 'center', color: '#b671b6', marginTop: 20, marginBottom: 5}}>This should approximately take:</Text>
            <Text style={styles.subHeader}>{hunt.duration}</Text>
            <CustomButton title='Confirm' hunt={hunt} markers={markers} navigation={navigation}></CustomButton>
            </View>
        </View>
    )
}

export default ConfirmHunt;