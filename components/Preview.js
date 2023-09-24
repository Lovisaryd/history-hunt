import { View, Image, Button, Pressable, Text } from "react-native";
import { useContext } from "react";
import * as http from '../util/http'
import { AuthContext } from "../AuthContext"
import { useNavigation } from "@react-navigation/native"
import * as MediaLibrary from "expo-media-library";
import axios from "axios";


const Preview = ({photo, styles, context, setHuntPhoto, setPlacePhoto, location, checkedOff, setCheckedOff, markers, huntObj, setHunts}) => {
    const navigation = useNavigation();
    
    const authctx = useContext(AuthContext)
      const token = authctx.token
    
      const pickphoto = async () => {
        if(context === 'avatar'){
          await http.updateProfile(token, photo)
          navigation.navigate('WelcomePage')
        } else if(context === 'create'){
          setHuntPhoto(photo)
          navigation.navigate('NewHunt')
        } else {
          setPlacePhoto({photo: photo, latitude: location})
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          const huntId = huntObj.hunt.id
          newList = [...checkedOff, {id: huntId, locations:[location]}]
          const huntExist = checkedOff.find((item) => item.id === huntId);

          //if hunt already exist in array, update it
          if (huntExist) {
            const huntExistIndex = checkedOff.findIndex((item) => item.id === huntId);
            const updatedHunt = { ...checkedOff[huntExistIndex] };
            updatedHunt.locations.push(location);
            const updatedList = [...checkedOff];
            updatedList[huntExistIndex] = updatedHunt;
            setCheckedOff(updatedList);
            //if all markers are checked off
            if(updatedHunt.locations.length === markers.length){
                const response = await http.updateHunt(huntObj, token)
                if(response !== 400){
                   const fetchHunts = await axios.get(`https://history-hunt-5b4c7-default-rtdb.europe-west1.firebasedatabase.app/hunts.json?auth=${token}`);
                    const arrayResult = Object.keys(fetchHunts.data).map((hunt) => ({
                id: hunt,
                createdBy: fetchHunts.data[hunt].createdBy,
                invited: fetchHunts.data[hunt].invited,
                checkpoints: fetchHunts.data[hunt].checkpoints,
                title: fetchHunts.data[hunt].title,
                duration: fetchHunts.data[hunt].duration,
                avatar: fetchHunts.data[hunt].avatar,
                completed: fetchHunts.data[hunt].completed
            }))
            setHunts(arrayResult);
            navigation.navigate('WelcomePage')
                }
            } else{
              navigation.navigate('MapScreen', {context: 'play', markers: markers, hunt: huntObj})
            }
          }  else {
            setCheckedOff(newList)
             navigation.navigate('MapScreen', {context: 'play', markers: markers, hunt: huntObj})
          }
        }
      }
      return(
        <View style={styles.preview}>
          <Image source={{uri: photo.uri}} style={styles.takenphotos}></Image>
          <Pressable onPress={pickphoto} style={{position: 'absolute', zIndex:1, alignSelf: 'center', backgroundColor: '#b671b6', paddingTop:10, paddingBottom:10, paddingLeft: 40, paddingRight: 40, borderRadius: 20, bottom: '55%'}}>
            <Text style={{fontSize: 14}}>Choose photo</Text>
          </Pressable>
        </View>
      )
    }

    export default Preview